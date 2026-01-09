CREATE UNIQUE INDEX IF NOT EXISTS documents_project_original_name_uq
  ON documents (project_id, original_name);

CREATE UNIQUE INDEX IF NOT EXISTS chunks_document_id_chunk_index_uq
  ON chunks (document_id, chunk_index);

CREATE UNIQUE INDEX IF NOT EXISTS integrations_project_platform_uq
  ON integrations (project_id, platform);
