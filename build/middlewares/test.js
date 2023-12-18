"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto = require("crypto");
// Secret key (replace with your own)
const secretKey = "vidyut";
// // Data to encrypt
// const dataToEncrypt = { message: "Hello, World!" };
// const dataToEncryptString = JSON.stringify(dataToEncrypt);
const encrypt = (data) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(secretKey), iv);
    let encryptedData = cipher.update(data, "utf8", "hex");
    encryptedData += cipher.final("hex");
    console.log("Encrypted Data:", encryptedData);
    return encryptedData;
};
exports.encrypt = encrypt;
// Encryption
const decrypt = (data) => {
    const iv = crypto.randomBytes(16);
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(secretKey), iv);
    let decryptedData = decipher.update(data, "hex", "utf8");
    decryptedData += decipher.final("utf8");
    console.log("Decrypted Data:", decryptedData);
    return decryptedData;
};
exports.decrypt = decrypt;
