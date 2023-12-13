"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = require("crypto");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY || 'vidyut';
// Example AES encryption and decryption functions
const salt = 'salt'; // You might want to use a secure, random salt
const ENCRYPTION_KEY = (0, crypto_1.scryptSync)(secretKey, salt, 32); // Note: scryptSync is synchronous, consider using scrypt with a callback for better performance
const IV = (0, crypto_1.randomBytes)(16);
// Custom replacer function for JSON.stringify
function replacer(key, value) {
    if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
        return { __isArray: true, data: value };
    }
    return value;
}
// Custom reviver function for JSON.parse
function reviver(key, value) {
    if (typeof value === 'object' && value !== null && value.__isArray) {
        return value.data;
    }
    return value;
}
function encrypt(data) {
    const text = JSON.stringify(data, replacer);
    const cipher = (0, crypto_1.createCipheriv)('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
    return encrypted;
}
exports.encrypt = encrypt;
function decrypt(encryptedText) {
    const decipher = (0, crypto_1.createDecipheriv)('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    try {
        return JSON.parse(decrypted, reviver);
    }
    catch (error) {
        console.error('Error parsing decrypted JSON:', error);
        return null; // Handle the error as per your application's requirements
    }
}
exports.decrypt = decrypt;
