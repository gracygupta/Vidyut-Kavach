import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = 'vidyut'; // Your secret key

// Hash the secret key using SHA-256 to create a deterministic key
const derivedKey = crypto.createHash('sha256').update(secretKey).digest();


const encrypt = (data: any): string => {
  const cipher = crypto.createCipheriv('aes-256-cbc', derivedKey, Buffer.alloc(16));
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
};

const decrypt = (data: any): string => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, Buffer.alloc(16));
  let decryptedData = decipher.update(data, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
};

export { encrypt, decrypt };
