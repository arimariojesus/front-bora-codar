import axios from 'axios';

const baseUrl = process.env.NODE_ENV === 'development' ?
  'http://localhost:3000/api/' :
  'https://bora-codar.vercel.app/api/';

export const api = axios.create({
  baseURL: baseUrl,
});