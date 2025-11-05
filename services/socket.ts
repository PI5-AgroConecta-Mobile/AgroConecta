import { io, Socket } from 'socket.io-client';
import api from './api';

let socket: Socket | null = null;

export function getSocket(token?: string): Socket {
  const baseURL = api.defaults.baseURL || '';
  if (!socket) {
    socket = io(baseURL, {
      transports: ['websocket'],
      forceNew: true,
      autoConnect: false,
      timeout: 10000,
    });
  }

  if (token) {
    socket.auth = { token };
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}


