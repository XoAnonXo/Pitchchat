import { Octokit } from "@octokit/rest";
import { Client as NotionClient } from "@notionhq/client";
import { google } from "googleapis";
import { Dropbox } from "dropbox";
import * as asana from "asana";
import { Version3Client } from "jira.js";
import { storage } from "./storage";
import { generateEmbedding } from "./aiModels";

export interface IntegrationConfig {
  type: 'github' | 'notion' | 'google-drive' | 'dropbox' | 'asana' | 'jira';
  credentials: Record<string, string>;
  userId: string;
  projectId: string;
}

export interface ImportedDocument {
  title: string;
  content: string;
  source: string;
  url?: string;
  type: string;
  metadata?: Record<string, any>;
}

export class IntegrationManager {
  
  // GitHub Integration
  async importFromGitHub(config: IntegrationConfig): Promise<ImportedDocument[]> {
    const octokit = new Octokit({
      auth: config.credentials.token
    });

    const documents: ImportedDocument[] = [];

    try {
      // Get user's repositories
      const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 10
      });

      for (const repo of repos) {
        // Get README files
        try {
          const { data: readme } = await octokit.rest.repos.getReadme({
            owner: repo.owner.login,
            repo: repo.name
          });

          if (readme.content) {
            const content = Buffer.from(readme.content, 'base64').toString('utf8');
            documents.push({
              title: `${repo.name} - README`,
              content: content,
              source: `GitHub: ${repo.full_name}`,
              url: readme.html_url,
              type: 'markdown',
              metadata: {
                repository: repo.name,
                stars: repo.stargazers_count,
                language: repo.language
              }
            });
          }
        } catch (error) {
          console.log(`No README found for ${repo.name}`);
        }

        // Get documentation files
        try {
          const { data: contents } = await octokit.rest.repos.getContent({
            owner: repo.owner.login,
            repo: repo.name,
            path: 'docs'
          });

          if (Array.isArray(contents)) {
            for (const file of contents.slice(0, 5)) { // Limit to 5 files
              if (file.type === 'file' && file.name.endsWith('.md')) {
                const { data: fileData } = await octokit.rest.repos.getContent({
                  owner: repo.owner.login,
                  repo: repo.name,
                  path: file.path
                });

                if ('content' in fileData && fileData.content) {
                  const content = Buffer.from(fileData.content, 'base64').toString('utf8');
                  documents.push({
                    title: `${repo.name} - ${file.name}`,
                    content: content,
                    source: `GitHub: ${repo.full_name}`,
                    url: fileData.html_url,
                    type: 'markdown',
                    metadata: {
                      repository: repo.name,
                      path: file.path
                    }
                  });
                }
              }
            }
          }
        } catch (error) {
          console.log(`No docs folder found for ${repo.name}`);
        }
      }
    } catch (error) {
      console.error('GitHub import error:', error);
      throw new Error('Failed to import from GitHub');
    }

    return documents;
  }

  // Notion Integration
  async importFromNotion(config: IntegrationConfig): Promise<ImportedDocument[]> {
    const notion = new NotionClient({
      auth: config.credentials.token
    });

    const documents: ImportedDocument[] = [];

    try {
      // Search for pages
      const response = await notion.search({
        query: '',
        filter: {
          property: 'object',
          value: 'page'
        }
      });

      for (const page of response.results.slice(0, 20)) { // Limit to 20 pages
        if ('properties' in page) {
          try {
            const blocks = await notion.blocks.children.list({
              block_id: page.id
            });

            let content = '';
            for (const block of blocks.results) {
              if ('type' in block) {
                content += this.extractNotionBlockText(block) + '\n';
              }
            }

            const title = this.extractNotionPageTitle(page);
            documents.push({
              title: title,
              content: content,
              source: `Notion: ${title}`,
              url: page.url,
              type: 'notion-page',
              metadata: {
                pageId: page.id,
                createdTime: page.created_time,
                lastEditedTime: page.last_edited_time
              }
            });
          } catch (error) {
            console.error(`Failed to fetch content for page ${page.id}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Notion import error:', error);
      throw new Error('Failed to import from Notion');
    }

    return documents;
  }

  // Google Drive Integration
  async importFromGoogleDrive(config: IntegrationConfig): Promise<ImportedDocument[]> {
    const auth = new google.auth.OAuth2(
      config.credentials.clientId,
      config.credentials.clientSecret,
      config.credentials.redirectUri
    );

    auth.setCredentials({
      access_token: config.credentials.accessToken,
      refresh_token: config.credentials.refreshToken
    });

    const drive = google.drive({ version: 'v3', auth });
    const docs = google.docs({ version: 'v1', auth });
    const sheets = google.sheets({ version: 'v4', auth });

    const documents: ImportedDocument[] = [];

    try {
      // Get files
      const response = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.document' or mimeType='application/vnd.google-apps.spreadsheet' or mimeType='application/vnd.google-apps.presentation'",
        fields: 'files(id, name, mimeType, modifiedTime)',
        pageSize: 20
      });

      for (const file of response.data.files || []) {
        try {
          let content = '';
          
          if (file.mimeType === 'application/vnd.google-apps.document') {
            // Google Docs
            const docResponse = await docs.documents.get({
              documentId: file.id!
            });
            content = this.extractGoogleDocText(docResponse.data);
          } else if (file.mimeType === 'application/vnd.google-apps.spreadsheet') {
            // Google Sheets
            const sheetResponse = await sheets.spreadsheets.get({
              spreadsheetId: file.id!
            });
            content = this.extractGoogleSheetText(sheetResponse.data);
          }

          if (content) {
            documents.push({
              title: file.name || 'Untitled',
              content: content,
              source: `Google Drive: ${file.name}`,
              url: `https://drive.google.com/file/d/${file.id}`,
              type: file.mimeType || 'unknown',
              metadata: {
                fileId: file.id,
                modifiedTime: file.modifiedTime
              }
            });
          }
        } catch (error) {
          console.error(`Failed to fetch content for file ${file.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Google Drive import error:', error);
      throw new Error('Failed to import from Google Drive');
    }

    return documents;
  }

  // Dropbox Integration
  async importFromDropbox(config: IntegrationConfig): Promise<ImportedDocument[]> {
    console.log('Starting Dropbox import with config:', { 
      hasAccessToken: !!config.credentials.accessToken,
      tokenLength: config.credentials.accessToken?.length || 0
    });

    const dbx = new Dropbox({
      accessToken: config.credentials.accessToken
    });

    const documents: ImportedDocument[] = [];
    const syncInfo = {
      totalFiles: 0,
      importedFiles: 0,
      skippedFiles: [] as string[],
      paperFiles: [] as string[],
      unsupportedFiles: [] as string[]
    };

    try {
      // First, test the connection by getting current user info
      console.log('Testing Dropbox connection...');
      const userInfo = await dbx.usersGetCurrentAccount();
      console.log('Dropbox connection successful for user:', userInfo.result.name.display_name);

      // List files in the root folder and subdirectories
      console.log('Listing files in Dropbox...');
      const response = await dbx.filesListFolder({ path: '', recursive: true, limit: 100 });
      console.log(`Found ${response.result.entries.length} items in Dropbox`);
      
      for (const entry of response.result.entries) {
        if (entry['.tag'] === 'file') {
          syncInfo.totalFiles++;
          const fileName = entry.name;
          const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
          
          console.log(`Processing file: ${fileName}`);
          
          // Support more file types
          const supportedTypes = ['.txt', '.md', '.doc', '.docx', '.pdf', '.csv', '.json', '.xml'];
          const isPaperFile = fileName.endsWith('.paper');
          const isSupported = supportedTypes.some(ext => fileName.toLowerCase().endsWith(ext));
          
          if (isSupported) {
            try {
              const fileResponse = await dbx.filesDownload({ path: entry.path_lower! });
              let content = '';
              
              // Handle different file types
              if (fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.endsWith('.json') || fileName.endsWith('.xml') || fileName.endsWith('.csv')) {
                content = (fileResponse.result as any).fileBinary.toString('utf8');
              } else if (fileName.endsWith('.pdf')) {
                // For PDFs, we'll store a placeholder and handle processing separately
                content = `[PDF Document: ${fileName}]\n\nThis PDF document needs to be processed separately.`;
              } else {
                // For .doc/.docx, store placeholder
                content = `[Document: ${fileName}]\n\nThis document needs to be processed separately.`;
              }
              
              if (content) {
                documents.push({
                  title: fileName,
                  content: content,
                  source: `Dropbox: ${fileName}`,
                  url: `https://dropbox.com/home${entry.path_lower}`,
                  type: fileExtension,
                  metadata: {
                    path: entry.path_lower,
                    size: entry.size,
                    modifiedTime: entry.server_modified
                  }
                });
                
                syncInfo.importedFiles++;
                console.log(`Successfully imported: ${fileName}`);
              }
            } catch (error) {
              console.error(`Failed to download file ${fileName}:`, error);
              syncInfo.skippedFiles.push(fileName);
            }
          } else if (isPaperFile) {
            console.log(`Found Dropbox Paper file: ${fileName}`);
            syncInfo.paperFiles.push(fileName);
          } else {
            console.log(`Skipping unsupported file type: ${fileName}`);
            syncInfo.unsupportedFiles.push(fileName);
          }
        }
      }
      
      // Log detailed summary
      console.log('Dropbox sync summary:', {
        totalFiles: syncInfo.totalFiles,
        importedFiles: syncInfo.importedFiles,
        paperFiles: syncInfo.paperFiles.length,
        unsupportedFiles: syncInfo.unsupportedFiles.length,
        skippedFiles: syncInfo.skippedFiles.length
      });
      
      if (syncInfo.paperFiles.length > 0) {
        console.log('Paper files found:', syncInfo.paperFiles);
        console.log('Note: Dropbox Paper files require special API access and cannot be imported with standard Dropbox API.');
      }
      
      // If no documents were imported but Paper files were found, return special message
      if (documents.length === 0 && syncInfo.paperFiles.length > 0) {
        throw new Error(`Found ${syncInfo.paperFiles.length} Dropbox Paper file(s), but they require special API access. Paper files: ${syncInfo.paperFiles.join(', ')}. Please export your Paper documents to regular file formats (PDF, DOCX) for import.`);
      }
      
      console.log(`Dropbox import completed. Found ${documents.length} documents.`);
    } catch (error) {
      console.error('Dropbox import error:', error);
      
      // Provide more specific error messages
      if (error.error && error.error.error_summary) {
        throw new Error(`Dropbox API Error: ${error.error.error_summary}`);
      } else if (error.status === 401) {
        throw new Error('Invalid Dropbox access token. Please check your token and try again.');
      } else {
        throw new Error(`Failed to import from Dropbox: ${error.message || error}`);
      }
    }

    return documents;
  }

  // Asana Integration
  async importFromAsana(config: IntegrationConfig): Promise<ImportedDocument[]> {
    const client = asana.Client.create({
      defaultHeaders: {
        'Authorization': `Bearer ${config.credentials.accessToken}`
      }
    });

    const documents: ImportedDocument[] = [];

    try {
      // Get projects
      const projects = await client.projects.getProjects();
      
      for (const project of projects.data.slice(0, 5)) {
        // Get tasks from project
        const tasks = await client.tasks.getTasksForProject(project.gid);
        
        let projectContent = `Project: ${project.name}\n\n`;
        
        for (const task of tasks.data.slice(0, 20)) {
          const taskDetails = await client.tasks.getTask(task.gid);
          projectContent += `Task: ${taskDetails.name}\n`;
          if (taskDetails.notes) {
            projectContent += `Notes: ${taskDetails.notes}\n`;
          }
          projectContent += `Status: ${taskDetails.completed ? 'Complete' : 'Incomplete'}\n\n`;
        }

        documents.push({
          title: `Asana Project: ${project.name}`,
          content: projectContent,
          source: `Asana: ${project.name}`,
          url: `https://app.asana.com/0/${project.gid}`,
          type: 'asana-project',
          metadata: {
            projectId: project.gid,
            taskCount: tasks.data.length
          }
        });
      }
    } catch (error) {
      console.error('Asana import error:', error);
      throw new Error('Failed to import from Asana');
    }

    return documents;
  }

  // Jira Integration
  async importFromJira(config: IntegrationConfig): Promise<ImportedDocument[]> {
    const client = new Version3Client({
      host: config.credentials.domain,
      authentication: {
        basic: {
          email: config.credentials.email,
          apiToken: config.credentials.apiToken
        }
      }
    });

    const documents: ImportedDocument[] = [];

    try {
      // Get projects
      const projects = await client.projects.getAllProjects();
      
      for (const project of projects.slice(0, 3)) {
        // Get issues from project
        const issues = await client.issueSearch.searchForIssuesUsingJql({
          jql: `project = ${project.key} ORDER BY updated DESC`,
          maxResults: 20
        });

        let projectContent = `Project: ${project.name}\nKey: ${project.key}\n\n`;
        
        for (const issue of issues.issues || []) {
          projectContent += `Issue: ${issue.fields?.summary}\n`;
          projectContent += `Type: ${issue.fields?.issuetype?.name}\n`;
          projectContent += `Status: ${issue.fields?.status?.name}\n`;
          if (issue.fields?.description) {
            projectContent += `Description: ${issue.fields.description}\n`;
          }
          projectContent += `\n`;
        }

        documents.push({
          title: `Jira Project: ${project.name}`,
          content: projectContent,
          source: `Jira: ${project.name}`,
          url: `${config.credentials.domain}/browse/${project.key}`,
          type: 'jira-project',
          metadata: {
            projectKey: project.key,
            issueCount: issues.issues?.length || 0
          }
        });
      }
    } catch (error) {
      console.error('Jira import error:', error);
      throw new Error('Failed to import from Jira');
    }

    return documents;
  }

  // Figma Integration
  async importFromFigma(config: IntegrationConfig): Promise<ImportedDocument[]> {
    console.log('Starting Figma import with access token');
    
    const documents: ImportedDocument[] = [];
    const figmaToken = config.credentials.accessToken;
    const headers = {
      'X-Figma-Token': figmaToken
    };

    try {
      // Get user's files (recent files)
      const filesResponse = await fetch('https://api.figma.com/v1/me/files?page_size=20', {
        headers
      });
      
      if (!filesResponse.ok) {
        throw new Error(`Figma API error: ${filesResponse.status} ${filesResponse.statusText}`);
      }
      
      const filesData = await filesResponse.json();
      console.log(`Found ${filesData.files?.length || 0} Figma files`);
      
      // Process each file
      for (const file of filesData.files || []) {
        try {
          // Get file details
          const fileResponse = await fetch(`https://api.figma.com/v1/files/${file.key}`, {
            headers
          });
          
          if (!fileResponse.ok) {
            console.error(`Failed to fetch file ${file.name}: ${fileResponse.status}`);
            continue;
          }
          
          const fileData = await fileResponse.json();
          
          // Extract content from the file
          let content = `Figma File: ${fileData.name}\n\n`;
          content += `Last Modified: ${fileData.lastModified}\n`;
          content += `Version: ${fileData.version}\n\n`;
          
          // Extract text from all pages
          if (fileData.document && fileData.document.children) {
            for (const page of fileData.document.children) {
              if (page.type === 'PAGE') {
                content += `\nPage: ${page.name}\n`;
                content += '---\n';
                
                // Extract text from the page
                const pageText = this.extractFigmaText(page);
                if (pageText) {
                  content += pageText + '\n';
                }
              }
            }
          }
          
          // Get comments for additional context
          const commentsResponse = await fetch(`https://api.figma.com/v1/files/${file.key}/comments`, {
            headers
          });
          
          if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json();
            if (commentsData.comments && commentsData.comments.length > 0) {
              content += '\n\nComments:\n';
              for (const comment of commentsData.comments) {
                content += `- ${comment.user.handle}: ${comment.message}\n`;
              }
            }
          }
          
          documents.push({
            title: file.name,
            content: content,
            source: `Figma: ${file.name}`,
            url: `https://www.figma.com/file/${file.key}`,
            type: 'figma',
            metadata: {
              fileKey: file.key,
              lastModified: fileData.lastModified,
              version: fileData.version
            }
          });
          
          console.log(`Successfully imported Figma file: ${file.name}`);
        } catch (error) {
          console.error(`Failed to process Figma file ${file.name}:`, error);
        }
      }
    } catch (error) {
      console.error('Figma import error:', error);
      throw new Error(`Failed to import from Figma: ${error.message}`);
    }
    
    return documents;
  }

  // Helper method to extract text from Figma nodes
  private extractFigmaText(node: any, depth: number = 0): string {
    let text = '';
    
    // Extract text from text nodes
    if (node.type === 'TEXT' && node.characters) {
      text += node.characters + '\n';
    }
    
    // Extract frame/component names and descriptions
    if ((node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') && node.name) {
      text += `${'  '.repeat(depth)}${node.type}: ${node.name}\n`;
    }
    
    // Recursively process children
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        text += this.extractFigmaText(child, depth + 1);
      }
    }
    
    return text;
  }

  // Process and store imported documents
  async processImportedDocuments(documents: ImportedDocument[], projectId: string): Promise<void> {
    for (const doc of documents) {
      try {
        // Create document record
        const document = await storage.createDocument({
          projectId,
          filename: doc.title,
          originalName: doc.title,
          fileSize: doc.content.length,
          mimeType: doc.type,
          status: 'processing'
        });

        // Create chunks and embeddings
        const chunks = this.chunkText(doc.content, 1000);
        
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          const embedding = await generateEmbedding(chunk);
          
          await storage.createChunk({
            documentId: document.id,
            content: chunk,
            embedding: embedding,
            metadata: {
              filename: doc.title,
              source: doc.source,
              url: doc.url,
              ...doc.metadata
            },
            tokenCount: Math.ceil(chunk.length / 4),
            chunkIndex: i
          });
        }

        // Update document status
        await storage.updateDocument(document.id, {
          status: 'completed',
          tokens: Math.ceil(doc.content.length / 4)
        });

      } catch (error) {
        console.error(`Failed to process document ${doc.title}:`, error);
      }
    }
  }

  // Helper methods
  private chunkText(text: string, maxLength: number): string[] {
    const chunks = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    let currentChunk = '';
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
      }
      currentChunk += sentence + '. ';
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }

  private extractNotionBlockText(block: any): string {
    const type = block.type;
    if (block[type]?.rich_text) {
      return block[type].rich_text.map((text: any) => text.plain_text).join('');
    }
    return '';
  }

  private extractNotionPageTitle(page: any): string {
    const titleProperty = Object.values(page.properties).find((prop: any) => prop.type === 'title');
    if (titleProperty && (titleProperty as any).title) {
      return (titleProperty as any).title.map((text: any) => text.plain_text).join('');
    }
    return 'Untitled';
  }

  private extractGoogleDocText(doc: any): string {
    let text = '';
    if (doc.body?.content) {
      for (const element of doc.body.content) {
        if (element.paragraph?.elements) {
          for (const textElement of element.paragraph.elements) {
            if (textElement.textRun?.content) {
              text += textElement.textRun.content;
            }
          }
        }
      }
    }
    return text;
  }

  private extractGoogleSheetText(sheet: any): string {
    let text = '';
    if (sheet.sheets) {
      for (const sheetTab of sheet.sheets) {
        if (sheetTab.properties?.title) {
          text += `Sheet: ${sheetTab.properties.title}\n`;
        }
        if (sheetTab.data?.[0]?.rowData) {
          for (const row of sheetTab.data[0].rowData) {
            if (row.values) {
              const rowText = row.values.map((cell: any) => 
                cell.formattedValue || cell.userEnteredValue?.stringValue || ''
              ).join('\t');
              text += rowText + '\n';
            }
          }
        }
      }
    }
    return text;
  }
}

export const integrationManager = new IntegrationManager();