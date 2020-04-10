import jsonwebtoken from 'jsonwebtoken';
import { env } from './environment';

/**
 * Sign a JWT, read secret from .env file
 *
 * @param payload the payload object
 * @param options the options
 * @returns promise
 */
export function jwtSign(
  payload: string | object | Buffer,
  options: jsonwebtoken.SignOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    jsonwebtoken.sign(payload, env.JWT_SECRET, options, (err, encoded) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(encoded);
    });
  });
}

/**
 * Verify a JWT, read secret from .env file
 *
 * @param token
 * @param options
 */
export function jwtVerify(
  token: string,
  options: jsonwebtoken.SignOptions = {}
): Promise<string | object | Buffer> {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, env.JWT_SECRET, options, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(decoded);
    });
  });
}
