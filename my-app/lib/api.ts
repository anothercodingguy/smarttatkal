// API utility functions
const getApiUrl = () => {
  // In development, use localhost backend
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:10000';
  }
  
  // In production, use environment variable or Render default
  return process.env.NEXT_PUBLIC_API_URL || 'https://smarttatkal-backend.onrender.com';
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
