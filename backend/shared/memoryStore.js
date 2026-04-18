import { photos } from './sampleData.js';
import { v4 as uuidv4 } from 'uuid';

export function getAllPhotosMemory() {
  return photos.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
}

export function getPhotoByIdMemory(id) {
  return photos.find((photo) => photo.id === id) || null;
}

export function searchPhotosMemory(query = '') {
  const q = query.toLowerCase().trim();
  if (!q) return getAllPhotosMemory();

  return photos.filter((photo) => {
    const haystack = [
      photo.title,
      photo.caption,
      photo.location,
      photo.peoplePresent,
      photo.category,
      ...(photo.aiTags || [])
    ].join(' ').toLowerCase();

    return haystack.includes(q);
  });
}

export function createPhotoMemory(payload) {
  const item = {
    id: payload.id || uuidv4(),
    title: payload.title,
    caption: payload.caption,
    location: payload.location,
    peoplePresent: payload.peoplePresent,
    category: payload.category || 'General',
    uploadedBy: payload.uploadedBy || 'Creator User',
    uploadDate: payload.uploadDate || new Date().toISOString(),
    rating: payload.rating || 0,
    imageUrl: payload.imageUrl || '',
    thumbnailUrl: payload.thumbnailUrl || '',
    aiTags: payload.aiTags || [],
    comments: payload.comments || []
  };

  photos.unshift(item);
  return item;
}

export function addPhotoCommentMemory(photoId, payload) {
  const photo = getPhotoByIdMemory(photoId);
  if (!photo) return null;

  const comment = {
    id: uuidv4(),
    user: payload.user || 'Consumer User',
    text: payload.comment || ''
  };

  photo.comments.push(comment);
  return comment;
}

export function addPhotoRatingMemory(photoId, payload) {
  const photo = getPhotoByIdMemory(photoId);
  if (!photo) return null;

  const nextRating = Number(payload.rating || 0);
  if (Number.isNaN(nextRating) || nextRating < 1 || nextRating > 5) {
    return { error: 'Rating must be between 1 and 5.' };
  }

  photo.rating = Number((((photo.rating || 0) + nextRating) / 2).toFixed(1));
  return { id: photo.id, rating: photo.rating };
}

export function updatePhotoTagsMemory(photoId, tags) {
  const photo = getPhotoByIdMemory(photoId);
  if (!photo) return null;
  photo.aiTags = tags;
  return photo;
}

export function updatePhotoThumbnailMemory(photoId, thumbnailUrl) {
  const photo = getPhotoByIdMemory(photoId);
  if (!photo) return null;
  photo.thumbnailUrl = thumbnailUrl;
  return photo;
}
