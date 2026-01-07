import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { isAuthenticated } from '../customAuth';
import { storage } from '../storage';
import { saveUploadedFile, processDocument, deleteUploadedFile } from '../fileProcessor';
import { insertDocumentSchema } from '@shared/schema';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/plain',
      'text/markdown',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    console.log('File upload filter - filename:', file.originalname, 'mimetype:', file.mimetype);

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error('Rejected file type:', file.mimetype, 'for file:', file.originalname);
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

/**
 * Get all documents for a project
 * GET /api/projects/:projectId/documents
 */
router.get('/projects/:projectId/documents', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const project = await storage.getProject(req.params.projectId);

    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const documents = await storage.getProjectDocuments(req.params.projectId);
    // Cache for 30 seconds with stale-while-revalidate for snappy refreshes
    res.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
});

/**
 * Upload a document to a project
 * POST /api/projects/:projectId/documents
 */
router.post('/projects/:projectId/documents', isAuthenticated, upload.single('file'), async (req: any, res) => {
  try {
    const userId = req.user.id;
    const project = await storage.getProject(req.params.projectId);

    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File upload received:', {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    // Check for duplicate
    const isDuplicate = await storage.checkDuplicateDocument(
      req.params.projectId,
      req.file.originalname
    );

    if (isDuplicate) {
      return res.json({
        isDuplicate: true,
        originalName: req.file.originalname,
        message: 'Document already exists',
      });
    }

    // Save file
    const filename = await saveUploadedFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Create document record
    const documentData = insertDocumentSchema.parse({
      projectId: req.params.projectId,
      filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      status: 'processing',
    });

    const document = await storage.createDocument(documentData);

    // Process document asynchronously
    processDocument(document.id).catch((error) => {
      console.error('Error processing document:', error);
    });

    res.json({ ...document, isDuplicate: false });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Failed to upload document' });
  }
});

/**
 * Delete a document
 * DELETE /api/documents/:id
 */
router.delete('/documents/:id', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const document = await storage.getDocument(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const project = await storage.getProject(document.projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file
    await deleteUploadedFile(document.filename);

    // Delete document record
    await storage.deleteDocument(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Failed to delete document' });
  }
});

/**
 * Download a document
 * GET /api/projects/:projectId/documents/:documentId/download
 */
router.get('/projects/:projectId/documents/:documentId/download', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { projectId, documentId } = req.params;

    const project = await storage.getProject(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const document = await storage.getDocument(documentId);
    if (!document || document.projectId !== projectId) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const filePath = path.join(process.cwd(), 'uploads', document.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on disk' });
    }

    res.download(filePath, document.originalName);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ message: 'Failed to download document' });
  }
});

export default router;
