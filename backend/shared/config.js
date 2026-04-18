import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 7071,
  storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
  storageContainer: process.env.AZURE_STORAGE_CONTAINER || 'photos',
  cosmosConnectionString: process.env.AZURE_COSMOS_CONNECTION_STRING || '',
  cosmosDatabase: process.env.AZURE_COSMOS_DATABASE || 'PixScaleDb',
  cosmosContainer: process.env.AZURE_COSMOS_CONTAINER || 'Photos',
  localUploadsDir: process.env.LOCAL_UPLOADS_DIR || 'uploads'
};

export function hasAzureCosmosConfig() {
  return Boolean(config.cosmosConnectionString && config.cosmosDatabase && config.cosmosContainer);
}

export function hasAzureStorageConfig() {
  return Boolean(config.storageConnectionString && config.storageContainer);
}
