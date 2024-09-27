import CryptoJS from 'crypto-js'

// 密钥key为固定值
const key = CryptoJS.enc.Utf8.parse('Xf3QwTqOYbB28i2w')
const IV = CryptoJS.enc.Utf8.parse('Gjk234Y401432Idlp')

// 加密 块模式mode、补充方式padding与后端同步
export function Encrypt(word: any) {
  if (typeof word == 'object') word = JSON.stringify(word)
  const dataHax = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(dataHax, key, {
    iv: IV,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

// 解密
export function Decrypt(word: any) {
  const bytes = CryptoJS.AES.decrypt(word, key, {
    iv: IV,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Utf8.stringify(bytes).toString()
}
