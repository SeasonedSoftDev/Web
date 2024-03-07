import crypto from 'crypto';

export const encryptCBC = (data: string, key: string) => {
  const algorithm = 'aes-256-cbc';
  const keyBuffer = Buffer.from(key, 'hex');
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return {
    iv: iv.toString('hex'),
    encrypted: encrypted.toString('hex'),
  };
};

export const dencryptCBC = (encryptedData: string, key: string, iv: string) => {
  const algorithm = 'aes-256-cbc';
  const keyBuffer = Buffer.from(key, 'hex');
  const ivBuffer = Buffer.from(iv, 'hex');
  const encryptredDataBuffer = Buffer.from(encryptedData, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
  let dencrypted = decipher.update(encryptredDataBuffer);
  dencrypted = Buffer.concat([dencrypted, decipher.final()]);

  return dencrypted.toString();
};

export const encryptECB = (data: string, key: string) => {
  const algorithm = 'aes-256-ecb';
  const keyBuffer = Buffer.from(key, 'hex');

  const cipher = crypto.createCipheriv(algorithm, keyBuffer, null);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

  return encrypted.toString('hex');
};

export const dencryptECB = (encryptedData: string, key: string) => {
  const algorithm = 'aes-256-ecb';
  const keyBuffer = Buffer.from(key, 'hex');
  const encryptredDataBuffer = Buffer.from(encryptedData, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, null);
  const dencrypted = Buffer.concat([
    decipher.update(encryptredDataBuffer),
    decipher.final(),
  ]);

  return dencrypted.toString();
};
