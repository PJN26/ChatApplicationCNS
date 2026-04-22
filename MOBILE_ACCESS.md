# 📱 Mobile Access Guide - Local Network

This guide explains how to access your encrypted chat application from your mobile device using your local WiFi network (no internet deployment needed).

## 📋 Prerequisites

- Your computer and mobile device must be on the **same WiFi network**
- Firewall must allow incoming connections on ports 3000 and 5000
- Both backend and frontend servers running on your computer

---

## 🚀 Step-by-Step Setup

### Step 1: Find Your Computer's Local IP Address

#### On Windows:
```powershell
ipconfig
```
Look for "IPv4 Address" under your active WiFi adapter (usually starts with `192.168.x.x` or `10.0.x.x`)

#### Example Output:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

**Your IP Address:** `192.168.1.100` (example - yours will be different)

---

### Step 2: Configure Backend for Network Access

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
FRONTEND_URL=http://192.168.1.100:3000
NODE_ENV=development
```

**Important:** Replace `192.168.1.100` with YOUR actual local IP address from Step 1.

The backend is already configured to accept this via `process.env.FRONTEND_URL`.

---

### Step 3: Configure Frontend for Network Access

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://192.168.1.100:5000
REACT_APP_SOCKET_URL=http://192.168.1.100:5000
```

**Important:** Replace `192.168.1.100` with YOUR actual local IP address from Step 1.

---

### Step 4: Configure Windows Firewall

Run PowerShell **as Administrator** and execute:

```powershell
# Allow incoming connections on port 5000 (Backend)
New-NetFirewallRule -DisplayName "Chat App Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow

# Allow incoming connections on port 3000 (Frontend)
New-NetFirewallRule -DisplayName "Chat App Frontend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

---

### Step 5: Start the Application

From the project root directory:

```powershell
# Start both servers
.\start.ps1
```

Or manually:
```powershell
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

---

### Step 6: Access from Mobile Device

#### On your mobile device:

1. **Connect to the same WiFi network** as your computer
2. **Open your mobile browser** (Chrome, Safari, etc.)
3. **Navigate to:** `http://192.168.1.100:3000`
   - Replace `192.168.1.100` with YOUR computer's IP address

That's it! You can now use the app on your mobile device! 📱✨

---

## 🔒 Important Security Notes

### ⚠️ Local Network Only
- This setup works **only on your local WiFi network**
- Your app is **NOT** accessible from the internet
- Data never leaves your local network

### ✅ Privacy Benefits
- No cloud hosting required
- All messages stay on your local network
- End-to-end encryption still works
- No third-party servers involved

### 🛡️ Firewall Rules
- The firewall rules allow connections from **any device on your network**
- Only allow these ports on your **home network** (not public WiFi)
- Disable/remove the firewall rules when not needed:
  ```powershell
  Remove-NetFirewallRule -DisplayName "Chat App Backend"
  Remove-NetFirewallRule -DisplayName "Chat App Frontend"
  ```

---

## 🐛 Troubleshooting

### Issue: Can't connect from mobile

**Solution 1:** Verify same WiFi network
- Ensure both devices are on the **same WiFi network** (not guest network)

**Solution 2:** Check IP address
```powershell
ipconfig
```
- Your IP may change when reconnecting to WiFi
- Update `.env` files with the new IP address
- Restart both servers

**Solution 3:** Test connectivity from mobile
- Open browser on mobile
- Visit: `http://192.168.1.100:5000/health`
- Should see: `{"status":"OK","message":"Encrypted Chat Server Running"}`

**Solution 4:** Check firewall rules
```powershell
# List firewall rules (run as Administrator)
Get-NetFirewallRule -DisplayName "Chat App*" | Format-Table
```

**Solution 5:** Restart servers
- Stop both servers (Ctrl+C)
- Run `start.ps1` again

---

### Issue: Connection works but can't send/receive messages

**Check Socket.IO connection:**
1. Open browser DevTools on mobile (use Chrome Remote Debugging)
2. Check Console for "✅ Socket connected" message
3. Verify `REACT_APP_SOCKET_URL` in frontend `.env` is correct

---

### Issue: IP address keeps changing

**Set a static IP on your router:**
1. Access your router settings (usually `192.168.1.1`)
2. Find DHCP settings
3. Reserve/bind your computer's MAC address to a fixed IP
4. This ensures your IP stays the same

---

## 📝 Quick Reference

| Component | URL Format | Example |
|-----------|-----------|---------|
| Frontend | `http://YOUR_IP:3000` | `http://192.168.1.100:3000` |
| Backend API | `http://YOUR_IP:5000/api` | `http://192.168.1.100:5000/api` |
| Health Check | `http://YOUR_IP:5000/health` | `http://192.168.1.100:5000/health` |

---

## 🎯 Alternative: Using Computer Name (Windows)

Instead of IP address, you can sometimes use your computer name:

1. Find computer name:
   ```powershell
   hostname
   ```

2. Try accessing from mobile:
   ```
   http://YOUR-COMPUTER-NAME.local:3000
   ```

**Note:** This may not work on all networks. Using IP address is more reliable.

---

## 💡 Tips

1. **Bookmark on mobile** - Save the URL (`http://192.168.1.100:3000`) to your home screen for quick access

2. **Keep computer awake** - Your computer must be on and running the servers for mobile access to work

3. **Battery saver** - Disable battery saver mode on your computer as it may throttle network

4. **Testing** - Test with your computer's browser first using the IP address before trying mobile

5. **Multiple devices** - You can connect multiple mobile devices simultaneously!

---

## ✅ Verification Checklist

- [ ] Found computer's local IP address (`ipconfig`)
- [ ] Created `backend/.env` with correct IP
- [ ] Created `frontend/.env` with correct IP  
- [ ] Added firewall rules for ports 3000 and 5000
- [ ] Started backend server (port 5000)
- [ ] Started frontend server (port 3000)
- [ ] Computer and mobile on same WiFi network
- [ ] Tested health endpoint from mobile browser
- [ ] Successfully logged in from mobile device

---

**Need help?** Check the troubleshooting section or verify each step carefully. 🚀
