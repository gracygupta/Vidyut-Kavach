import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = 'vidyut'; // Your secret key

// Hash the secret key using SHA-256 to create a deterministic key
const derivedKey = Buffer.from('df2322531b43acab18fef92847ae0047fa513198398f70c5f28cb6c6b6308de0', 'hex');
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
