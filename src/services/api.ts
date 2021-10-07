import axios from 'axios';

const baseUrl = 'https://api-bora-codar.herokuapp.com/api';

export const api = axios.create({
  baseURL: baseUrl,
});