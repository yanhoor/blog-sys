import CryptoJS from "crypto-js";

// 密钥key为固定值
const key = CryptoJS.enc.Utf8.parse("Xf3QwTqOYbB28i2w");

// 加密 块模式mode、补充方式padding与后端同步
export function Encrypt(word: string) {
  const word1 = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(word1, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

// 解密
export function Decrypt(word: string) {
  const bytes = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(bytes).toString();
}
