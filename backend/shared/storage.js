import { v4 as uuidv4 } from 'uuid';
import { hasAzureCosmosConfig, hasAzureStorageConfig } from './config.js';
import {
  getAllPhotosMemory,
  getPhotoByIdMemory,
  searchPhotosMemory,
  createPhotoMemory,
  addPhotoCommentMemory,
  addPhotoRatingMemory,
  updatePhotoTagsMemory,
  updatePhotoThumbnailMemory
} from './memoryStore.js';
import {
  getAllPhotosCosmos,
  getPhotoByIdCosmos,
  searchPhotosCosmos,
  createPhotoCosmos,
  replacePhotoCosmos
} from './cosmosProvider.js';
import { saveImageUrlAsReference, generateThumbnailReference, uploadImageBuffer } from './blobProvider.js';

function createBasePhoto(payload) {
  return {
    id: uuidv4(),
    title: payload.title,
    caption: payload.caption,
    location: payload.location,
    peoplePresent: payload.peoplePresent,
    category: payload.category || 'General',
    uploadedBy: payload.uploadedBy || 'Creator User',
    uploadDate: new Date().toISOString(),
    rating: 0,
    imageUrl: payload.imageUrl || '',
    thumbnailUrl: '',
    aiTags: [],
    comments: []
  };
}

export async function getAllPhotos() {
  if (hasAzureCosmosConfig()) return getAllPhotosCosmos();
  return getAllPhotosMemory();
}

export async function getPhotoById(id) {
  if (hasAzureCosmosConfig()) return getPhotoByIdCosmos(id);
  return getPhotoByIdMemory(id);
}

export async function searchPhotos(query = '') {
  if (hasAzureCosmosConfig()) return searchPhotosCosmos(query);
  return searchPhotosMemory(query);
}

export async function createPhoto(payload) {
  const base = createBasePhoto(payload);

  if (base.imageUrl) {
    base.imageUrl = await saveImageUrlAsReference(base.imageUrl);
  }

  if (hasAzureCosmosConfig()) {
    return createPhotoCosmos(base);
  }

  return createPhotoMemory(base);
}

export async function createPhotoFromFile(payload, file) {
  const base = createBasePhoto(payload);

  if (file) {
    base.imageUrl = await uploadImageBuffer(file);
    if (!hasAzureStorageConfig() && base.imageUrl.startsWith('/local-uploads/')) {
      base.thumbnailUrl = base.imageUrl;
    }
  } else if (base.imageUrl) {
    base.imageUrl = await saveImageUrlAsReference(base.imageUrl);
  }

  if (hasAzureCosmosConfig()) {
    return createPhotoCosmos(base);
  }

  return createPhotoMemory(base);
}

export async function addPhotoComment(photoId, payload) {
  if (!hasAzureCosmosConfig()) {
    return addPhotoCommentMemory(photoId, payload);
  }

  const photo = await getPhotoByIdCosmos(photoId);
  if (!photo) return null;

  const comment = {
    id: uuidv4(),
    user: payload.user || 'Consumer User',
    text: payload.comment || ''
  };

  photo.comments = [...(photo.comments || []), comment];
  await replacePhotoCosmos(photo);
  return comment;
}

export async function addPhotoRating(photoId, payload) {
  if (!hasAzureCosmosConfig()) {
    return addPhotoRatingMemory(photoId, payload);
  }

  const photo = await getPhotoByIdCosmos(photoId);
  if (!photo) return null;

  const nextRating = Number(payload.rating || 0);
  if (Number.isNaN(nextRating) || nextRating < 1 || nextRating > 5) {
    return { error: 'Rating must be between 1 and 5.' };
  }

  photo.rating = Number((((photo.rating || 0) + nextRating) / 2).toFixed(1));
  await replacePhotoCosmos(photo);
  return { id: photo.id, rating: photo.rating };
}

export async function updatePhotoTags(photoId, tags) {
  if (!hasAzureCosmosConfig()) {
    return updatePhotoTagsMemory(photoId, tags);
  }

  const photo = await getPhotoByIdCosmos(photoId);
  if (!photo) return null;

  photo.aiTags = tags;
  return replacePhotoCosmos(photo);
}

export async function updatePhotoThumbnail(photoId) {
  if (!hasAzureCosmosConfig()) {
    const photo = await getPhotoById(photoId);
    if (!photo) return null;
    const thumbnailUrl = photo.imageUrl ? await generateThumbnailReference(photo.imageUrl) : '';
    return updatePhotoThumbnailMemory(photoId, thumbnailUrl || photo.imageUrl);
  }

  const photo = await getPhotoByIdCosmos(photoId);
  if (!photo) return null;

  photo.thumbnailUrl = photo.imageUrl ? await generateThumbnailReference(photo.imageUrl) : '';
  return replacePhotoCosmos(photo);
}
