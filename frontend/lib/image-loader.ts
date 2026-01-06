export const getAssetUrl = (path: string) => {
  if (path.startsWith('http')) return path;
  const baseUrl = 'https://storage.googleapis.com/aiml-coe-web-app';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
