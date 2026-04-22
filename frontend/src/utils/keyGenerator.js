import CryptoJS from 'crypto-js';

/**
 * 🔑 SHARED KEY GENERATION MODULE
 * 
 * Generates deterministic 16-byte AES key from two usernames
 */

/**
 * Generate Shared Key
 * 
 * Algorithm:
 * 1. Sort usernames alphabetically
 * 2. Combine: userA:userB:APP_SECRET
 * 3. SHA256 hash
 * 4. Take first 16 bytes
 */
export const generateSharedKey = (usernameA, usernameB) => {
  try {
    // Sort usernames to ensure both parties generate the same key
    const sortedNames = [usernameA.toString(), usernameB.toString()].sort();
    
    // Combine with app secret
    const combinedString = `${sortedNames[0]}:${sortedNames[1]}:${process.env.REACT_APP_APP_SECRET}`;
    
    // Hash using SHA256
    const hash = CryptoJS.SHA256(combinedString);
    
    // Take first 16 bytes (32 hex chars) for AES-128
    const sharedKey = CryptoJS.lib.WordArray.create(hash.words.slice(0, 4));
    
    return sharedKey;
  } catch (error) {
    console.error('Key generation error:', error);
    throw new Error('Failed to generate shared key');
  }
};

/**
 * Generate key as hex string
 */
export const generateSharedKeyHex = (usernameA, usernameB) => {
  const key = generateSharedKey(usernameA, usernameB);
  return key.toString(CryptoJS.enc.Hex);
};

/**
 * Verify key generation (for debugging)
 */
export const verifyKeyGeneration = (usernameA, usernameB) => {
  const key1 = generateSharedKeyHex(usernameA, usernameB);
  const key2 = generateSharedKeyHex(usernameB, usernameA);
  
  return key1 === key2;
};
