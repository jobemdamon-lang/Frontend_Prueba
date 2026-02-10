var CryptoJS = require("crypto-js");

export function encryptData(text: string) {

  let password = process.env.REACT_APP_KEY;
  let salt = process.env.REACT_APP_SALT;
  let iterations = 128;
  let bytes = CryptoJS.PBKDF2(password, salt, { keySize: 48, iterations: iterations });
  let iv = CryptoJS.enc.Hex.parse(bytes.toString().slice(0, 32));
  let key = CryptoJS.enc.Hex.parse(bytes.toString().slice(32, 96));

  let ciphertext = CryptoJS.AES.encrypt(text, key, { iv: iv });
  return ciphertext.toString()

};

