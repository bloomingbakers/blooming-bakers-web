export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/cake.png';
  if (imagePath.startsWith('http')) return imagePath;
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');
  
  // If it's an uploaded image, fetch it from the backend
  if (imagePath.startsWith('/uploads')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // Otherwise it's a frontend asset (like /images/cake.png)
  return imagePath;
};
