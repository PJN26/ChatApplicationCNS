/**
 * ⚡ SOCKET.IO EVENT HANDLERS (Simplified)
 * 
 * Handles real-time messaging with encrypted payloads
 * No authentication - users join with username only
 * Server NEVER sees plaintext - only forwards encrypted data
 */

// Store active users in memory
const activeUsers = new Map(); // username -> socketId

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    /**
     * 🔗 USER JOIN
     * User joins with a username
     */
    socket.on('join', (username) => {
      try {
        // Store username and socket ID
        socket.username = username;
        activeUsers.set(username, socket.id);
        
        console.log(`👤 User joined: ${username}`);
        
        // Send list of online users to all clients
        const onlineUsers = Array.from(activeUsers.keys());
        io.emit('online-users', onlineUsers);
      } catch (error) {
        console.error('Join error:', error);
        socket.emit('error', { message: 'Failed to join' });
      }
    });

    /**
     * 📤 SEND ENCRYPTED MESSAGE
     * 
     * Payload format:
     * {
     *   sender: string (username),
     *   receiver: string (username),
     *   encryptedPayload: string (Base64),
     *   iv: string (Base64),
     *   hmac: string (Base64),
     *   timestamp: Date
     * }
     */
    socket.on('send-message', (data) => {
      try {
        const { sender, receiver, encryptedPayload, iv, hmac, timestamp } = data;

        // Validate required fields
        if (!sender || !receiver || !encryptedPayload || !iv || !hmac) {
          socket.emit('error', { message: 'Invalid message format' });
          return;
        }

        // Find receiver's socket ID
        const receiverSocketId = activeUsers.get(receiver);
        
        if (receiverSocketId) {
          // Send encrypted message to receiver
          io.to(receiverSocketId).emit('receive-message', {
            sender,
            receiver,
            encryptedPayload,
            iv,
            hmac,
            timestamp: timestamp || new Date()
          });

          console.log(`\n📨 Message sent: ${sender} → ${receiver}`);
          console.log(`🔐 Cipher Text: ${encryptedPayload}`);
          console.log(`🔑 IV: ${iv}`);
          console.log(`🛡️  HMAC: ${hmac}\n`);
        } else {
          // Receiver offline
          console.log(`📪 Receiver offline: ${receiver}`);
        }
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    /**
     * 🔔 TYPING INDICATOR
     */
    socket.on('typing', ({ sender, receiver }) => {
      try {
        const receiverSocketId = activeUsers.get(receiver);
        
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('user-typing', {
            username: sender
          });
        }
      } catch (error) {
        console.error('Typing indicator error:', error);
      }
    });

    /**
     * 🔕 STOP TYPING
     */
    socket.on('stop-typing', ({ sender, receiver }) => {
      try {
        const receiverSocketId = activeUsers.get(receiver);
        
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('user-stop-typing', {
            username: sender
          });
        }
      } catch (error) {
        console.error('Stop typing error:', error);
      }
    });

    /**
     * 🚪 DISCONNECT
     */
    socket.on('disconnect', () => {
      try {
        if (socket.username) {
          // Remove user from active users
          activeUsers.delete(socket.username);

          // Broadcast updated online users list
          const onlineUsers = Array.from(activeUsers.keys());
          io.emit('online-users', onlineUsers);

          console.log(`❌ User disconnected: ${socket.username}`);
        }
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    });
  });
};

module.exports = setupSocketHandlers;
