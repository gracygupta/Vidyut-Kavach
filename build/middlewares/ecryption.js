"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = 'vidyut'; // Your secret key
// Hash the secret key using SHA-256 to create a deterministic key
const derivedKey = Buffer.from('df2322531b43acab18fef92847ae0047fa513198398f70c5f28cb6c6b6308de0', 'hex');
const encrypt = (data) => {
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', derivedKey, Buffer.alloc(16));
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
};
exports.encrypt = encrypt;
const decrypt = (data) => {
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', derivedKey, Buffer.alloc(16));
    let decryptedData = decipher.update(data, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
};
exports.decrypt = decrypt;
