import axios from 'axios';
// Use relative path so it hits Vercel Serverless Functions in prod, and proxy in local dev
const API_URL = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  register: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  login: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  getMe: async () => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  // Events
  getEvents: async () => {
    const res = await fetch(`${API_URL}/events`);
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  createEvent: async (data: any) => {
    const res = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  updateEvent: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  deleteEvent: async (id: string) => {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  // Registrations
  registerForEvent: async (eventId: string) => {
    const res = await fetch(`${API_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ eventId })
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  getMyRegistrations: async () => {
    const res = await fetch(`${API_URL}/registrations/me`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  getAllRegistrations: async () => {
    const res = await fetch(`${API_URL}/registrations`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  // Messages
  sendMessage: async (data: any) => {
    const res = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  getMessages: async () => {
    const res = await fetch(`${API_URL}/messages`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  // Upload
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  }
};
