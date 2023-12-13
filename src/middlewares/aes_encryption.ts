import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const secretKey: string = process.env.SECRET_KEY || 'vidyut';

// Example AES encryption and decryption functions
const salt = 'salt'; // You might want to use a secure, random salt
const ENCRYPTION_KEY = scryptSync(secretKey, salt, 32); // Note: scryptSync is synchronous, consider using scrypt with a callback for better performance
const IV = randomBytes(16);

// Custom replacer function for JSON.stringify
function replacer(key: string, value: any) {
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return { __isArray: true, data: value };
  }
  return value;
}

// Custom reviver function for JSON.parse
function reviver(key: string, value: any) {
  if (typeof value === 'object' && value !== null && value.__isArray) {
    return value.data;
  }
  return value;
}

export function encrypt(data: any): string {
  const text = JSON.stringify(data, replacer);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  console.log(encrypted);
  return encrypted;
}

export function decrypt(encryptedText: string): any {
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  try {
    return JSON.parse(decrypted, reviver);
  } catch (error) {
    console.error('Error parsing decrypted JSON:', error);
    return null; // Handle the error as per your application's requirements
  }
}
