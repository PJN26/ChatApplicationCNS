# Simplified Encrypted Chat - Usage Guide

## 🎯 Overview

This is a simplified end-to-end encrypted chat application. **No login or registration required!** Just enter your name and start chatting.

## 🚀 Quick Start

1. **Start the application:**
   ```powershell
   .\start.ps1
   ```

2. **Open the chat:**
   - Frontend will open at: http://localhost:3000
   - Backend runs at: http://localhost:5000

3. **Join and chat:**
   - Enter your name on the welcome screen
   - See other online users
   - Click on a user to start a 1-to-1 encrypted chat

## ✨ Features

- **No Authentication Required** - Just enter a username to join
- **1-to-1 Messaging** - Direct encrypted messaging between users
- **Real-time Communication** - Messages delivered instantly via WebSocket
- **End-to-End Encryption** - AES-128-CBC encryption
- **Message Integrity** - HMAC-SHA256 verification
- **Online Status** - See who's currently online
- **Typing Indicators** - See when the other person is typing

## 🔐 Security

- All messages are encrypted on the client-side before being sent
- Server only sees encrypted data, never plaintext
- Shared keys are generated deterministically from usernames
- Each message has a unique random IV (Initialization Vector)
- HMAC ensures message integrity and authenticity

## 📝 How It Works

1. **User joins** with a username (no password needed)
2. **Server tracks** online users in memory
3. **User selects** another online user to chat with
4. **Messages are encrypted** on sender's device using AES-128-CBC
5. **Server forwards** encrypted data to recipient
6. **Recipient decrypts** message on their device

## 💡 Testing with Multiple Users

To test the chat:

1. Open http://localhost:3000 in **multiple browser tabs or windows**
2. Enter different usernames in each window (e.g., "Alice", "Bob", "Charlie")
3. Select a user from the online list to start chatting
4. Send messages back and forth to test encryption

## 🛠️ Technical Details

### Frontend
- **React** - UI framework
- **Socket.io-client** - Real-time communication
- **CryptoJS** - Encryption library
- **AES-128-CBC** - Encryption algorithm
- **HMAC-SHA256** - Message authentication

### Backend
- **Node.js + Express** - Server framework
- **Socket.io** - WebSocket server
- **No database** - All data in memory (session-based)

## 📋 Notes

- **No message history** - Messages are not saved to database
- **Session-based** - Messages only exist during the session
- **Same username conflict** - Last user with the same name will replace the previous one
- **No persistence** - Refreshing the page requires re-entering your name

## 🔄 Workflow

```
User A                     Server                      User B
   |                          |                           |
   |-- Join with username --> |                           |
   |                          |-- Broadcast users ------->|
   |                          |<-- Join with username ----|
   |<-- Broadcast users ------|                           |
   |                          |                           |
   |-- Select User B          |                           |
   |-- Encrypt message        |                           |
   |-- Send encrypted ------->|                           |
   |                          |-- Forward encrypted ----->|
   |                          |                 Decrypt --|
   |                          |                 Display --|
```

## 🎨 Customization

You can customize the app by editing:
- **Frontend styling**: `frontend/src/components/*.css`
- **Encryption settings**: `frontend/src/utils/encryption.js`
- **Server port**: Change `PORT` in `backend/.env`
- **Frontend URL**: Change `REACT_APP_SOCKET_URL` in `frontend/.env`

## 🐛 Troubleshooting

**Connection issues:**
- Make sure backend is running on port 5000
- Check that frontend is configured to connect to correct URL
- Verify no firewall blocking WebSocket connections

**Decryption errors:**
- Both users must use the exact same usernames during the session
- Usernames are case-sensitive

**Users not showing:**
- Wait 1-2 seconds after joining
- Check browser console for errors
- Verify WebSocket connection is established

## 📚 Learn More

See these files for detailed documentation:
- `ENCRYPTION_DOCS.md` - Encryption implementation details
- `PROJECT_OVERVIEW.md` - Full project architecture
- `QUICKSTART.md` - Setup and installation guide
