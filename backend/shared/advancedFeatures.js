import { getPhotoById, updatePhotoTags, updatePhotoThumbnail } from './storage.js';

export async function generateMockAiTags(photoId) {
  const photo = await getPhotoById(photoId);
  if (!photo) return null;

  const generated = Array.from(new Set([...(photo.aiTags || []), 'azure-ai', 'smart-search', 'auto-tagged']));
  const updated = await updatePhotoTags(photoId, generated);

  return {
    id: updated.id,
    aiTags: updated.aiTags,
    mode: 'mock'
  };
}

export async function createMockThumbnail(photoId) {
  const photo = await updatePhotoThumbnail(photoId);
  if (!photo) return null;

  return {
    id: photo.id,
    thumbnailUrl: photo.thumbnailUrl,
    mode: 'mock'
  };
}
