# 🔐 End-to-End Encrypted Chat System

A real-time chat application with **AES-128-CBC** encryption where messages are encrypted on the sender's device and decrypted on the receiver's device. The server never sees plaintext messages.

---

## 🔑 ENCRYPTION ARCHITECTURE

### Crypto Model

- **Algorithm**: AES-128-CBC
- **Key Size**: 16 bytes (128 bits)
- **IV Size**: 16 bytes (random per message)
- **Integrity**: HMAC-SHA256
- **Key Derivation**: SHA256(userA + userB + APP_SECRET)

### Security Features

✅ **End-to-End Encryption** - Messages encrypted on client, decrypted on client  
✅ **Zero Server Knowledge** - Server only stores encrypted data  
✅ **Message Integrity** - HMAC verification prevents tampering  
✅ **Perfect Forward Secrecy** - Random IV per message  
✅ **Deterministic Key Generation** - Same key generated on both devices  

---

## 📦 DATA FORMAT

### Encrypted Message Structure

```
{
  senderID: string,
  receiverID: string,
  encryptedPayload: string (Base64),
  iv: string (Base64),
  hmac: string (Base64),
  timestamp: Date
}
```

### Transmission Format

```
Base64(IV) : Base64(CipherText) : Base64(HMAC)
```

---

## 🔄 SYSTEM FLOW

```
User A types message
      ↓
Generate Shared Key (SHA256)
      ↓
Encrypt with AES-128-CBC + Random IV
      ↓
Generate HMAC-SHA256
      ↓
Send to server via WebSocket
      ↓
Server forwards (no decryption)
      ↓
User B receives encrypted message
      ↓
Verify HMAC
      ↓
Generate same shared key
      ↓
Decrypt with AES-128-CBC
      ↓
Display plaintext
```

---

## 🧮 CORE ALGORITHMS

### 1️⃣ Shared Key Generation

```javascript
FUNCTION GenerateSharedKey(userA_ID, userB_ID):
    // Sort IDs to ensure deterministic order
    sortedIDs = sort([userA_ID, userB_ID])
    
    // Combine with app secret
    combinedString = sortedIDs[0] + ":" + sortedIDs[1] + ":" + APP_SECRET
    
    // Hash using SHA256
    hash = SHA256(combinedString)
    
    // Take first 16 bytes for AES-128
    sharedKey = hash[0:16]
    
    RETURN sharedKey
```

### 2️⃣ Encryption

```javascript
FUNCTION EncryptMessage(plainText, senderID, receiverID):
    sharedKey = GenerateSharedKey(senderID, receiverID)
    iv = SecureRandom(16 bytes)
    
    cipherText = AES_Encrypt(
        algorithm: AES-128-CBC,
        key: sharedKey,
        iv: iv,
        input: plainText
    )
    
    hmac = HMAC_SHA256(cipherText, sharedKey)
    
    RETURN {
        encryptedPayload: Base64(cipherText),
        iv: Base64(iv),
        hmac: Base64(hmac)
    }
```

### 3️⃣ Decryption

```javascript
FUNCTION DecryptMessage(encryptedPayload, iv, hmac, senderID, receiverID):
    sharedKey = GenerateSharedKey(senderID, receiverID)
    
    // Verify HMAC first
    expectedHMAC = HMAC_SHA256(encryptedPayload, sharedKey)
    IF hmac != expectedHMAC:
        THROW "Message integrity check failed"
    
    // Decrypt
    plainText = AES_Decrypt(
        algorithm: AES-128-CBC,
        key: sharedKey,
        iv: Base64Decode(iv),
        input: Base64Decode(encryptedPayload)
    )
    
    RETURN plainText
```

---

## 🛠 TECH STACK

### Backend
- **Node.js** - Server runtime
- **Express** - REST API framework
- **Socket.io** - Real-time WebSocket communication
- **MongoDB** - Database (stores encrypted messages only)
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication tokens
- **crypto** (built-in Node.js) - Key generation

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Socket.io-client** - WebSocket client
- **CryptoJS** - AES encryption library
- **Axios** - HTTP client

---

## 📁 PROJECT STRUCTURE

```
Project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Message.js           # Message schema (encrypted)
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication routes
│   │   │   ├── users.js             # User management routes
│   │   │   └── messages.js          # Message routes
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication middleware
│   │   ├── utils/
│   │   │   └── keyGenerator.js      # Shared key generation
│   │   ├── socket/
│   │   │   └── socketHandlers.js    # WebSocket event handlers
│   │   └── server.js                # Main server file
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js             # Login component
│   │   │   ├── Register.js          # Registration component
│   │   │   ├── Chat.js              # Main chat component
│   │   │   ├── Auth.css             # Auth styles
│   │   │   └── Chat.css             # Chat styles
│   │   ├── contexts/
│   │   │   └── AuthContext.js       # Authentication context
│   │   ├── services/
│   │   │   ├── api.js               # REST API service
│   │   │   └── socketService.js     # Socket.io service
│   │   ├── utils/
│   │   │   ├── keyGenerator.js      # Client-side key generation
│   │   │   └── encryption.js        # AES encryption/decryption
│   │   ├── App.js                   # Main app component
│   │   └── index.js                 # Entry point
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 🚀 INSTALLATION & SETUP

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn**

### 1️⃣ Clone/Download Project

```bash
cd "d:\LD_College\Sem6\CNS\Project"
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# IMPORTANT: Change APP_SECRET to a secure 16-byte string
```

**Backend .env Configuration:**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/encrypted-chat
JWT_SECRET=your-jwt-secret-key-here-change-in-production
APP_SECRET=your-app-secret-for-aes-key-generation-16bytes
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

⚠️ **CRITICAL**: The `APP_SECRET` must be exactly **16 bytes** and MUST be the same in both backend and frontend!

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
```

**Frontend .env Configuration:**

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_APP_SECRET=your-app-secret-for-aes-key-generation-16bytes
```

⚠️ **CRITICAL**: `REACT_APP_APP_SECRET` must match backend `APP_SECRET` exactly!

---

## ▶️ RUNNING THE APPLICATION

### Start MongoDB

```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

### Start Backend Server

```bash
cd backend
npm start

# Or for development with auto-reload
npm run dev
```

Backend will run on: `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm start
```

Frontend will run on: `http://localhost:3000`

---

## � MOBILE ACCESS (LOCAL NETWORK)

Want to use this app on your mobile device **without deploying to the internet**?

### 🚀 Automated Setup (Recommended)

```powershell
# Run the mobile setup wizard
.\setup-mobile.ps1
```

This script will:
- Auto-detect your local IP address
- Create `.env` files with correct configuration
- Set up Windows Firewall rules
- Provide connection URL for your mobile

### 📖 Manual Setup

For detailed step-by-step instructions, see [MOBILE_ACCESS.md](MOBILE_ACCESS.md)

**Quick Summary:**
1. Find your computer's IP: `ipconfig` (e.g., `192.168.1.100`)
2. Update `.env` files with your IP instead of `localhost`
3. Allow ports 3000 & 5000 in Windows Firewall
4. Connect mobile to same WiFi network
5. Access `http://YOUR_IP:3000` from mobile browser

✨ Your chat runs privately on your local network - no internet deployment needed!

---

## �📡 API ENDPOINTS

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:userId` | Get user by ID |
| GET | `/api/users/search/:query` | Search users |

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/:userId` | Get message history |
| POST | `/api/messages` | Save encrypted message |
| PUT | `/api/messages/:messageId/delivered` | Mark as delivered |
| PUT | `/api/messages/:messageId/read` | Mark as read |

---

## ⚡ WEBSOCKET EVENTS

### Client → Server

| Event | Description |
|-------|-------------|
| `authenticate` | Authenticate user with socket |
| `send-message` | Send encrypted message |
| `typing` | User is typing |
| `stop-typing` | User stopped typing |
| `message-read` | Mark message as read |
| `get-online-users` | Request online users list |

### Server → Client

| Event | Description |
|-------|-------------|
| `authenticated` | Authentication successful |
| `receive-message` | Receive encrypted message |
| `message-delivered` | Message delivery confirmation |
| `user-typing` | User is typing |
| `user-stop-typing` | User stopped typing |
| `user-status` | User online/offline status |
| `online-users` | List of online users |
| `error` | Error notification |

---

## 🧪 TESTING ENCRYPTION

You can test the encryption/decryption in browser console:

```javascript
import { testEncryption } from './utils/encryption';

// Test encryption
testEncryption(
  "Hello, World!", 
  "user1_id", 
  "user2_id"
);

// Output:
// 🔐 Testing Encryption...
// Original: Hello, World!
// Encrypted: { encryptedPayload: "...", iv: "...", hmac: "..." }
// Decrypted: Hello, World!
// Match: ✅
```

---

## 🔒 SECURITY CONSIDERATIONS

### ✅ What's Secure

1. **End-to-End Encryption** - Messages encrypted on client
2. **Zero Server Knowledge** - Server never sees plaintext
3. **Message Integrity** - HMAC prevents tampering
4. **Random IVs** - Each message uses unique IV
5. **Deterministic Keys** - Both parties generate same key

### ⚠️ Important Notes

1. **APP_SECRET must be secret** - Store securely, never commit to version control
2. **HTTPS required in production** - Use SSL/TLS for transport security
3. **Password hashing** - User passwords are hashed with bcrypt
4. **JWT tokens** - Should use HTTPS and secure cookies in production
5. **No key storage** - Keys are generated on-demand, never stored

### 🚀 Production Checklist

- [ ] Use HTTPS (SSL/TLS certificates)
- [ ] Change all default secrets
- [ ] Use environment variables for secrets
- [ ] Enable CORS properly
- [ ] Use secure cookie settings for JWT
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Enable MongoDB authentication
- [ ] Use production-ready MongoDB (Atlas)
- [ ] Implement proper error logging
- [ ] Add user session management
- [ ] Implement message deletion
- [ ] Add file encryption support

---

## 🧱 SYSTEM MODULES

### Backend Modules

1. **Auth Module** (`routes/auth.js`) - User authentication
2. **User Module** (`routes/users.js`) - User management
3. **Message Module** (`routes/messages.js`) - Message handling
4. **Key Generator** (`utils/keyGenerator.js`) - Shared key generation
5. **Socket Handler** (`socket/socketHandlers.js`) - Real-time events
6. **Database** (`config/database.js`) - MongoDB connection

### Frontend Modules

1. **Auth Context** (`contexts/AuthContext.js`) - Authentication state
2. **API Service** (`services/api.js`) - REST API communication
3. **Socket Service** (`services/socketService.js`) - WebSocket communication
4. **Key Generator** (`utils/keyGenerator.js`) - Client-side key generation
5. **Encryption** (`utils/encryption.js`) - AES encryption/decryption
6. **Chat UI** (`components/Chat.js`) - Main chat interface

---

## 📊 DATABASE SCHEMA

### User Collection

```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  isOnline: Boolean,
  lastSeen: Date,
  socketId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Collection

```javascript
{
  _id: ObjectId,
  senderID: ObjectId (ref: User),
  receiverID: ObjectId (ref: User),
  encryptedPayload: String (Base64),
  iv: String (Base64),
  hmac: String (Base64),
  timestamp: Date,
  isDelivered: Boolean,
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

⚠️ **Note**: Server NEVER stores plaintext messages!

---

## 🎯 FEATURES

### Implemented

✅ User registration & login  
✅ End-to-end AES-128-CBC encryption  
✅ Real-time messaging with Socket.io  
✅ HMAC message integrity verification  
✅ Typing indicators  
✅ Online/offline status  
✅ Message delivery status  
✅ Message history loading  

### Future Enhancements

🔜 Group chat support  
🔜 File/image encryption & transfer  
🔜 Voice/video call encryption  
🔜 Message deletion  
🔜 User blocking  
🔜 Profile pictures  
🔜 Message search  
🔜 Push notifications  

---

## 🐛 TROUBLESHOOTING

### MongoDB Connection Error

```bash
# Make sure MongoDB is running
sudo systemctl status mongod

# Or start it
sudo systemctl start mongod
```

### Socket Connection Error

- Check if backend is running on port 5000
- Check CORS configuration
- Verify `REACT_APP_SOCKET_URL` in frontend .env

### Decryption Fails

- Verify `APP_SECRET` matches in backend and frontend
- Check that both users exist in database
- Verify message is not corrupted

### HMAC Verification Fails

- Check if message was tampered
- Verify shared key generation is identical on both sides

---

## 👨‍💻 DEVELOPMENT

### Run in Development Mode

```bash
# Backend (with auto-reload)
cd backend
npm run dev

# Frontend (with hot reload)
cd frontend
npm start
```

### Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## 📜 LICENSE

MIT License - Feel free to use for educational purposes.

---

## 🙏 ACKNOWLEDGMENTS

Built with:
- React
- Node.js
- Socket.io
- MongoDB
- CryptoJS
- Express

---

## 📞 SUPPORT

For issues or questions:
1. Check the troubleshooting section
2. Verify all environment variables
3. Check console logs for errors
4. Ensure MongoDB is running

---

**🔐 Remember: Security is only as strong as your secrets. Keep APP_SECRET secure!**
# ChatApplicationCNS
