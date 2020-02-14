import crypto from 'crypto';

const getEncryptUrl = (url: string, key: string): string => {
  // ref: https://oss.navercorp.com/api-gateway/api-gateway-hmac/blob/master/javascript/lib/macManager.js
  const messageMaxSize = 255;
  const algorithm = 'sha1';
  const currentTime: number = new Date().getTime();
  const message = `${url.substring(0, Math.min(messageMaxSize, url.length))}${currentTime}`;
  const md: string = encodeURIComponent(
    // url encode
    crypto
      .createHmac(algorithm, key)
      .update(message)
      .digest('base64'),
  );

  const separator: string = url.indexOf('?') !== -1 ? '&' : '?';
  const encryptedUrl = `${url}${separator}msgpad=${currentTime}&md=${md}`;
  return encryptedUrl;
};

export default getEncryptUrl;
