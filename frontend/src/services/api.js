const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7071/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...(options.headers ? { headers: options.headers } : {}),
    ...options
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export async function getHealth() {
  return request('/health');
}

export async function getPhotos() {
  return request('/photos');
}

export async function getPhotoById(id) {
  return request(`/photos/${id}`);
}

export async function searchPhotos(query) {
  return request(`/photos/search?q=${encodeURIComponent(query)}`);
}

export async function uploadPhoto(payload) {
  return request('/photos/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export async function uploadPhotoForm(formData) {
  return request('/photos/upload-file', {
    method: 'POST',
    body: formData
  });
}

export async function addComment(photoId, payload) {
  return request(`/photos/${photoId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export async function addRating(photoId, payload) {
  return request(`/photos/${photoId}/ratings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export async function generateAiTags(photoId) {
  return request(`/photos/${photoId}/generate-tags`, { method: 'POST' });
}

export async function createThumbnail(photoId) {
  return request(`/photos/${photoId}/thumbnail`, { method: 'POST' });
}
