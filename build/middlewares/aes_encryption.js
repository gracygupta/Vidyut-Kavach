"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = require("crypto");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let secretKey = process.env.SECRET_KEY ? process.env.SECRET_KEY : 'vidyut';
// Example AES encryption and decryption functions
const ENCRYPTION_KEY = (0, crypto_1.scryptSync)(secretKey, 'salt', 32);
const IV = (0, crypto_1.randomBytes)(16);
function encrypt(text) {
    const cipher = (0, crypto_1.createCipheriv)('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
exports.encrypt = encrypt;
function decrypt(encryptedText) {
    const decipher = (0, crypto_1.createDecipheriv)('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}
exports.decrypt = decrypt;
