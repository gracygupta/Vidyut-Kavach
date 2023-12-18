const crypto = require('crypto');

const secretKey = 'your-secret-key';
const salt = crypto.randomBytes(16); // Generate a random salt
const iterations = 10000; // Number of iterations
const keyLength = 32; // Desired key length in bytes

crypto.pbkdf2(secretKey, salt, iterations, keyLength, 'sha256', (err, derivedKey) => {
  if (err) {
    console.error(err);
  } else {
    console.log(derivedKey);
  }
});