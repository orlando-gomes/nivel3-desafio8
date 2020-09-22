import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

export default api;

// run $ adb reverse tcp:3333 tcp:3333
// baseURL: 'http://192.168.0.108:3333',
