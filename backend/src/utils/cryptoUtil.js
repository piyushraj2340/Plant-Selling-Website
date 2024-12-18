require('dotenv').config(); // Load .env variables
const crypto = require('crypto');

// Load the 32-byte secret key from environment variable
const SECRET_KEY = Buffer.from(process.env.SECRET_KEY, 'hex'); // Convert hex to Buffer
const IV_LENGTH = 16; // AES block size

/**
 * Encrypt a message.
 * @param {string} message - The plaintext message to encrypt.
 * @returns {Object} An object containing the encrypted message and the IV used.
 */
function encryptMessage(message) {
  const iv = crypto.randomBytes(IV_LENGTH); // Generate a random IV
  const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);

  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encryptedMessage: encrypted,
    iv: iv.toString('hex') // Store IV as hex for easier usage
  };
}

/**
 * Decrypt a message.
 * @param {string} encryptedMessage - The encrypted message (in hex).
 * @param {string} ivHex - The initialization vector (in hex).
 * @returns {string} The decrypted plaintext message.
 */
function decryptMessage(encryptedMessage, ivHex) {
  const iv = Buffer.from(ivHex, 'hex'); // Convert IV back to a buffer
  const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);

  let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Export the functions
module.exports = {
  encryptMessage,
  decryptMessage
};
