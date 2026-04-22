import CryptoJS from 'crypto-js';
import { generateSharedKey } from './keyGenerator';

/**
 * 🔐 AES ENCRYPTION MODULE
 * 
 * AES-128-CBC Encryption with random IV
 */

/**
 * Generate Random IV (16 bytes)
 */
const generateIV = () => {
  return CryptoJS.lib.WordArray.random(16);
};

/**
 * Encrypt Message
 * 
 * @param {string} plainText - Message to encrypt
 * @param {string} sender - Sender username
 * @param {string} receiver - Receiver username
 * @returns {object} { encryptedPayload, iv, hmac }
 */
export const encryptMessage = (plainText, sender, receiver) => {
  try {
    // 1. Generate shared key
    const sharedKey = generateSharedKey(sender, receiver);
    
    // 2. Generate random IV
    const iv = generateIV();
    
    // 3. Encrypt using AES-128-CBC
    const encrypted = CryptoJS.AES.encrypt(plainText, sharedKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // 4. Get ciphertext
    const cipherText = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    
    // 5. Generate HMAC for integrity
    const hmac = generateHMAC(cipherText, sharedKey);
    
    // 6. Return payload
    return {
      encryptedPayload: cipherText,
      iv: iv.toString(CryptoJS.enc.Base64),
      hmac: hmac
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt message');
  }
};

/**
 * Generate HMAC for message integrity
 * 
 * HMAC = SHA256(cipherText + sharedKey)
 */
const generateHMAC = (cipherText, sharedKey) => {
  try {
    const hmac = CryptoJS.HmacSHA256(cipherText, sharedKey);
    return hmac.toString(CryptoJS.enc.Base64);
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

/**
 * Decrypt Message
 * 
 * @param {string} encryptedPayload - Base64 encoded ciphertext
 * @param {string} ivBase64 - Base64 encoded IV
 * @param {string} hmac - Base64 encoded HMAC
 * @param {string} sender - Sender username
 * @param {string} receiver - Receiver username (current user)
 * @returns {string} Decrypted plaintext
 */
export const decryptMessage = (encryptedPayload, ivBase64, hmac, sender, receiver) => {
  try {
    // 1. Generate shared key (same as encryption)
    const sharedKey = generateSharedKey(sender, receiver);
    
    // 2. Verify HMAC first
    if (!verifyHMAC(hmac, encryptedPayload, sharedKey)) {
      throw new Error('HMAC verification failed - message may be tampered');
    }
    
    // 3. Parse IV
    const iv = CryptoJS.enc.Base64.parse(ivBase64);
    
    // 4. Parse ciphertext
    const cipherText = CryptoJS.enc.Base64.parse(encryptedPayload);
    
    // 5. Create cipher params
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: cipherText
    });
    
    // 6. Decrypt using AES-128-CBC
    const decrypted = CryptoJS.AES.decrypt(cipherParams, sharedKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // 7. Convert to UTF8 string
    const plainText = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!plainText) {
      throw new Error('Decryption failed - invalid key or corrupted data');
    }
    
    return plainText;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt message: ' + error.message);
  }
};

/**
 * Test encryption/decryption
 */
export const testEncryption = (message, userA, userB) => {
  try {
    console.log('🔐 Testing Encryption...');
    console.log('Original:', message);
    
    // Encrypt
    const encrypted = encryptMessage(message, userA, userB);
    console.log('Encrypted:', encrypted);
    
    // Decrypt
    const decrypted = decryptMessage(
      encrypted.encryptedPayload,
      encrypted.iv,
      encrypted.hmac,
      userA,
      userB
    );
    console.log('Decrypted:', decrypted);
    
    console.log('Match:', message === decrypted ? '✅' : '❌');
    
    return message === decrypted;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
};
