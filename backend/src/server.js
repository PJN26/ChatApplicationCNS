require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const setupSocketHandlers = require('./socket/socketHandlers');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Encrypted Chat Server Running',
    timestamp: new Date()
  });
});

// Setup Socket.IO event handlers
setupSocketHandlers(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🔐 ENCRYPTED CHAT SERVER STARTED 🔐     ║');
  console.log('╠════════════════════════════════════════════╣');
  console.log(`║   📡 Server: http://localhost:${PORT}       ║`);
  console.log(`║   ⚡ WebSocket: Active                     ║`);
  console.log(`║   🔒 Encryption: AES-128-CBC               ║`);
  console.log(`║   🛡️  HMAC: SHA-256                        ║`);
  console.log(`║   👤 No Login Required - Username Only     ║`);
  console.log('╚════════════════════════════════════════════╝');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = { app, server, io };
