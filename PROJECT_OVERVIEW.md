# 🔐 Encrypted Chat System

> End-to-end encrypted real-time chat with AES-128-CBC encryption

## 📂 PROJECT STRUCTURE

```
Project/
├── backend/              Backend server (Node.js + Socket.io)
├── frontend/             Frontend app (React)
├── README.md            Complete documentation
├── QUICKSTART.md        Quick start guide
├── ENCRYPTION_DOCS.md   Detailed encryption documentation
├── setup.ps1            Automated setup script
└── start.ps1            Start all services
```

## 🚀 QUICK START

### Option 1: Automated Setup (Recommended)

```powershell
# Run setup script
.\setup.ps1

# Then follow the instructions to:
# 1. Configure APP_SECRET in .env files
# 2. Start services
.\start.ps1
```

### Option 2: Manual Setup

See [QUICKSTART.md](QUICKSTART.md) for detailed step-by-step instructions.

## 📚 DOCUMENTATION

- **[README.md](README.md)** - Complete project documentation
- **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide with examples
- **[ENCRYPTION_DOCS.md](ENCRYPTION_DOCS.md)** - Technical encryption details

## 🔑 KEY FEATURES

✅ **AES-128-CBC** encryption  
✅ **End-to-end** security  
✅ **Zero server knowledge**  
✅ **HMAC-SHA256** integrity  
✅ **Real-time** messaging  
✅ **Modern UI** with React  

## 🛠 TECH STACK

**Backend**: Node.js, Express, Socket.io, MongoDB  
**Frontend**: React, CryptoJS  
**Crypto**: AES-128-CBC, SHA-256, HMAC  

## 📖 LEARN MORE

This project demonstrates:
- Symmetric encryption (AES)
- Message authentication (HMAC)
- Key derivation (SHA-256)
- Real-time WebSocket communication
- Full-stack React + Node.js development

## 🔒 SECURITY

All messages are encrypted on the sender's device and decrypted on the receiver's device. The server never sees plaintext!

---

**Made for CNS Project - Sem 6**
