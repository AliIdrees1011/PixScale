import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { config, hasAzureCosmosConfig, hasAzureStorageConfig } from './shared/config.js';
import {
  getAllPhotos,
  getPhotoById,
  searchPhotos,
  createPhoto,
  createPhotoFromFile,
  addPhotoComment,
  addPhotoRating
} from './shared/storage.js';
import { validateUploadPayload } from './shared/validators.js';
import { generateMockAiTags, createMockThumbnail } from './shared/advancedFeatures.js';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());
app.use('/local-uploads', express.static(path.resolve(process.cwd(), config.localUploadsDir || 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'pixscale-backend',
    persistence: hasAzureCosmosConfig() ? 'azure-cosmos' : 'memory',
    media: hasAzureStorageConfig() ? 'azure-blob-ready' : 'local-file-fallback'
  });
});

app.get('/api/photos', async (_req, res) => {
  res.json(await getAllPhotos());
});

app.get('/api/photos/search', async (req, res) => {
  const q = req.query.q || '';
  res.json(await searchPhotos(q));
});

app.get('/api/photos/:id', async (req, res) => {
  const photo = await getPhotoById(req.params.id);
  if (!photo) {
    return res.status(404).json({ message: 'Photo not found.' });
  }
  res.json(photo);
});

app.post('/api/photos/upload', async (req, res) => {
  const validation = validateUploadPayload(req.body);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const photo = await createPhoto(req.body);
  res.status(201).json(photo);
});

app.post('/api/photos/upload-file', upload.single('imageFile'), async (req, res) => {
  const payload = {
    title: req.body.title,
    caption: req.body.caption,
    location: req.body.location,
    peoplePresent: req.body.peoplePresent,
    category: req.body.category
  };

  const validation = validateUploadPayload(payload);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const photo = await createPhotoFromFile(payload, req.file || null);
  res.status(201).json(photo);
});

app.post('/api/photos/:id/comments', async (req, res) => {
  const comment = await addPhotoComment(req.params.id, req.body);
  if (!comment) {
    return res.status(404).json({ message: 'Photo not found.' });
  }
  res.status(201).json(comment);
});

app.post('/api/photos/:id/ratings', async (req, res) => {
  const result = await addPhotoRating(req.params.id, req.body);
  if (!result) {
    return res.status(404).json({ message: 'Photo not found.' });
  }
  if (result.error) {
    return res.status(400).json({ message: result.error });
  }
  res.status(201).json(result);
});

app.post('/api/photos/:id/generate-tags', async (req, res) => {
  const result = await generateMockAiTags(req.params.id);
  if (!result) {
    return res.status(404).json({ message: 'Photo not found.' });
  }
  res.status(201).json(result);
});

app.post('/api/photos/:id/thumbnail', async (req, res) => {
  const result = await createMockThumbnail(req.params.id);
  if (!result) {
    return res.status(404).json({ message: 'Photo not found.' });
  }
  res.status(201).json(result);
});

app.listen(config.port, () => {
  console.log(`PixScale backend running on port ${config.port}`);
});
