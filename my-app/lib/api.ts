// API utility functions
const getApiUrl = () => {
  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return '';
  }
  
  // In production, you'll need to replace this with your actual backend URL
  // For example: https://your-backend.vercel.app or https://your-backend.herokuapp.com
  return process.env.NEXT_PUBLIC_API_URL || '';
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}${endpoint}`;
  
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
};
