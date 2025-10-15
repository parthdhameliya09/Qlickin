import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): void {
    if (!this.socket) {
      // Replace with your actual backend URL
      this.socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000', {
        auth: { token },
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export default new SocketService();
