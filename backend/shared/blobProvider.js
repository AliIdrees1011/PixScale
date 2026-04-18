import fs from 'fs';
import path from 'path';
import { BlobServiceClient } from '@azure/storage-blob';
import { config, hasAzureStorageConfig } from './config.js';

let containerClientRef = null;

async function getContainerClient() {
  if (containerClientRef) return containerClientRef;

  const serviceClient = BlobServiceClient.fromConnectionString(config.storageConnectionString);
  const containerClient = serviceClient.getContainerClient(config.storageContainer);
  await containerClient.createIfNotExists();
  containerClientRef = containerClient;
  return containerClient;
}

export async function saveImageUrlAsReference(imageUrl) {
  return imageUrl || '';
}

export async function uploadImageBuffer(file) {
  if (!file) return '';

  if (hasAzureStorageConfig()) {
    const containerClient = await getContainerClient();
    const blobName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype || 'application/octet-stream'
      }
    });

    return blockBlobClient.url;
  }

  const uploadsDir = path.resolve(process.cwd(), config.localUploadsDir || 'uploads');
  fs.mkdirSync(uploadsDir, { recursive: true });
  const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
  const localPath = path.join(uploadsDir, safeName);
  fs.writeFileSync(localPath, file.buffer);

  return `/local-uploads/${safeName}`;
}

export async function generateThumbnailReference(imageUrl) {
  return imageUrl || '';
}
