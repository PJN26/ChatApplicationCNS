import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  /**
   * 🔗 CONNECT TO SOCKET SERVER
   */
  connect(username) {
    if (this.socket && this.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.connected = true;
      
      // Join with username
      this.socket.emit('join', username);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  /**
   * 📤 SEND ENCRYPTED MESSAGE
   */
  sendMessage(messageData) {
    if (!this.socket || !this.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('send-message', messageData);
  }

  /**
   * 📥 LISTEN FOR INCOMING MESSAGES
   */
  onMessage(callback) {
    if (!this.socket) return;
    
    this.socket.on('receive-message', callback);
  }

  /**
   * 🔔 TYPING INDICATOR
   */
  sendTyping(sender, receiver) {
    if (!this.socket || !this.connected) return;
    
    this.socket.emit('typing', { sender, receiver });
  }

  /**
   * 🔕 STOP TYPING
   */
  sendStopTyping(sender, receiver) {
    if (!this.socket || !this.connected) return;
    
    this.socket.emit('stop-typing', { sender, receiver });
  }

  /**
   * 👥 LISTEN FOR TYPING
   */
  onTyping(callback) {
    if (!this.socket) return;
    
    this.socket.on('user-typing', callback);
  }

  /**
   * 👥 LISTEN FOR STOP TYPING
   */
  onStopTyping(callback) {
    if (!this.socket) return;
    
    this.socket.on('user-stop-typing', callback);
  }

  /**
   * 📊 LISTEN FOR ONLINE USERS
   */
  onOnlineUsers(callback) {
    if (!this.socket) return;
    
    this.socket.on('online-users', callback);
  }

  /**
   * ❌ ERROR HANDLER
   */
  onError(callback) {
    if (!this.socket) return;
    
    this.socket.on('error', callback);
  }

  /**
   * 🚪 DISCONNECT
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      console.log('Socket disconnected manually');
    }
  }

  /**
   * 🔄 RECONNECT
   */
  reconnect(username) {
    this.disconnect();
    this.connect(username);
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
