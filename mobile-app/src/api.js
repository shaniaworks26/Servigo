import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const DEFAULT_API_BASE_URL = Platform.OS === 'web' ? 'http://localhost:5005/api' : 'http://10.0.2.2:5005/api';
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');

const getAuthHeaders = async () => {
  const stored = await AsyncStorage.getItem('servigo-auth');
  const auth = stored ? JSON.parse(stored) : null;
  return auth?.tokens?.accessToken
    ? { Authorization: `Bearer ${auth.tokens.accessToken}` }
    : {};
};

const request = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(await getAuthHeaders()),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.message || (typeof payload === 'string' ? payload : 'Request failed'));
  }

  return payload?.data ?? payload;
};

export const loginUser = (payload) => request('/auth/login', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const registerUser = (payload) => request('/auth/register', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const getProfile = () => request('/users/profile');
export const getServices = () => request('/services');
export const getProviders = () => request('/providers');
export const getBookings = () => request('/bookings/my-bookings');
export const createBooking = (payload) => request('/bookings', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const getNotifications = () => request('/notifications');
export const getMessages = () => request('/messages');
export const updateProfile = (payload) => request('/users/profile', {
  method: 'PUT',
  body: JSON.stringify(payload),
});
