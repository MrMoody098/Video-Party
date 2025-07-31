// API configuration utility
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

export const getVideoUrl = (filename: string) => {
  return `${API_BASE_URL}/api/video/${filename}`;
};

export const getThumbnailUrl = (filename: string) => {
  return `${API_BASE_URL}/api/thumbnail/${filename}`;
}; 