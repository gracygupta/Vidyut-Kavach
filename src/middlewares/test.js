import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

let secretKey = process.env.SECRET_KEY? process.env.SECRET_KEY : 'vidyut' ;

// Example AES encryption and decryption functions
const ENCRYPTION_KEY = scryptSync(secretKey, 'salt', 32);
const IV = randomBytes(16);

data = {
  success: true,
  data: "data",
}

function encrypt(data) {
  const text = JSON.stringify(data);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  console.log("Encrypted:", encrypted);
  decrypt("Decrypted:", encrypted)
}

function decrypt(encryptedText) {
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  console.log(decrypted)
}

encrypt(data);