export function validateUploadPayload(payload) {
  const requiredFields = ['title', 'caption', 'location', 'peoplePresent'];
  const missing = requiredFields.filter((field) => !payload?.[field]?.toString().trim());

  if (missing.length > 0) {
    return {
      valid: false,
      message: `Missing required fields: ${missing.join(', ')}`
    };
  }

  return { valid: true };
}
