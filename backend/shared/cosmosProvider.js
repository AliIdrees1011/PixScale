import { CosmosClient } from '@azure/cosmos';
import { config } from './config.js';

let containerRef = null;

async function getContainer() {
  if (containerRef) return containerRef;

  const client = new CosmosClient(config.cosmosConnectionString);
  const { database } = await client.databases.createIfNotExists({ id: config.cosmosDatabase });
  const { container } = await database.containers.createIfNotExists({
    id: config.cosmosContainer,
    partitionKey: { paths: ['/id'] }
  });

  containerRef = container;
  return container;
}

export async function getAllPhotosCosmos() {
  const container = await getContainer();
  const { resources } = await container.items.readAll().fetchAll();
  return resources.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
}

export async function getPhotoByIdCosmos(id) {
  const container = await getContainer();
  try {
    const { resource } = await container.item(id, id).read();
    return resource || null;
  } catch {
    return null;
  }
}

export async function searchPhotosCosmos(query = '') {
  const q = query.toLowerCase().trim();
  const items = await getAllPhotosCosmos();
  if (!q) return items;

  return items.filter((photo) => {
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

export async function createPhotoCosmos(payload) {
  const container = await getContainer();
  const item = {
    id: payload.id,
    title: payload.title,
    caption: payload.caption,
    location: payload.location,
    peoplePresent: payload.peoplePresent,
    category: payload.category || 'General',
    uploadedBy: payload.uploadedBy || 'Creator User',
    uploadDate: payload.uploadDate,
    rating: payload.rating || 0,
    imageUrl: payload.imageUrl || '',
    thumbnailUrl: payload.thumbnailUrl || '',
    aiTags: payload.aiTags || [],
    comments: payload.comments || []
  };
  const { resource } = await container.items.create(item);
  return resource;
}

export async function replacePhotoCosmos(photo) {
  const container = await getContainer();
  const { resource } = await container.item(photo.id, photo.id).replace(photo);
  return resource;
}
