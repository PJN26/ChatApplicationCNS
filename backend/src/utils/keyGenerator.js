const crypto = require('crypto');

/**
 * 🔑 SHARED KEY GENERATION
 * 
 * Generates a deterministic 16-byte AES key from two user IDs
 * Both sender and receiver will generate the same key
 * 
 * Algorithm:
 * 1. Sort user IDs alphabetically (ensures same order on both sides)
 * 2. Combine: userA:userB:APP_SECRET
 * 3. SHA256 hash
 * 4. Take first 16 bytes
 */
const generateSharedKey = (userA_ID, userB_ID) => {
  try {
    // Sort IDs to ensure both parties generate the same key
    const sortedIDs = [userA_ID.toString(), userB_ID.toString()].sort();
    
    // Combine with app secret
    const combinedString = `${sortedIDs[0]}:${sortedIDs[1]}:${process.env.APP_SECRET}`;
    
    // Hash using SHA256
    const hash = crypto.createHash('sha256').update(combinedString).digest();
    
    // Take first 16 bytes for AES-128
    const sharedKey = hash.slice(0, 16);
    
    return sharedKey;
  } catch (error) {
    console.error('Key generation error:', error);
    throw new Error('Failed to generate shared key');
  }
};

/**
 * Generates key as Base64 string (for client-side communication)
 */
const generateSharedKeyBase64 = (userA_ID, userB_ID) => {
  const key = generateSharedKey(userA_ID, userB_ID);
  return key.toString('base64');
};

/**
 * Verify HMAC for message integrity
 * 
 * HMAC = SHA256(cipherText + sharedKey)
 */
const generateHMAC = (cipherText, sharedKey) => {
  try {
    const hmac = crypto.createHmac('sha256', sharedKey);
    hmac.update(cipherText);
    return hmac.digest('base64');
  } catch (error) {
    console.error('HMAC generation error:', error);
    throw new Error('Failed to generate HMAC');
  }
};

/**
 * Verify HMAC
 */
const verifyHMAC = (receivedHMAC, cipherText, sharedKey) => {
  const expectedHMAC = generateHMAC(cipherText, sharedKey);
  return receivedHMAC === expectedHMAC;
};

module.exports = {
  generateSharedKey,
  generateSharedKeyBase64,
  generateHMAC,
  verifyHMAC
};
