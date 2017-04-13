import cookie from 'react-cookie';

export function getCurrentUser() {
  return cookie.load('user') || null;
}

export function getToken() {
  return cookie.load('token') || null;
}

