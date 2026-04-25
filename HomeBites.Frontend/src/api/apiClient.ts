import axios from 'axios'

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'
export const IMAGE_BASE_URL = BASE_URL.replace('/api', '')

export const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${IMAGE_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export const apiClient = axios.create({
  baseURL: BASE_URL
})
