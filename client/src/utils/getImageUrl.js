export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/cake.png';
  if (imagePath.startsWith('http')) return imagePath;
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');
  
  // Ensure the image path starts with a slash
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${path}`;
};
