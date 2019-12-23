import { mocked } from 'ts-jest/utils';
const dotenv = require('dotenv');
import { getRepository } from 'typeorm';
import { jwtSign, jwtVerify } from './security-helpers';
import { Request, Response } from 'express';
import { getAuthUser, setAuthCookie, deleteAuthCookie } from './auth-helper';

jest.mock('dotenv', () => ({
  load: jest.fn().mockImplementation(() => ({
    parsed: {SALT: '', JWT_SECRET: ''}
  }))
}));

/**
 * mock JWT signing and verification
 */
jest.mock('./security-helpers', () => ({
  jwtSign: jest.fn().mockImplementation((payload, options) => {
    return new Promise((resolve, reject) => {
      resolve(JSON.stringify(payload));
    });
  }),
  jwtVerify: jest.fn().mockImplementation((token, options) => {
    return new Promise((resolve, reject) => {
      resolve(JSON.parse(token));
    });
  })
}));

/**
 * mock typeORM database stuff.
 */
jest.mock('typeorm', () => ({
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  Entity: jest.fn(),
  getConnection: jest.fn(),
  getRepository: jest.fn()
}));

beforeEach(() => {
  mocked(dotenv.load).mockClear();
  mocked(jwtSign).mockClear();
  mocked(jwtVerify).mockClear();
  mocked(getRepository).mockClear();
});

describe('auth-helper functions test', () => {
  
  test('getAuthUser without cookie', async () => {
    const identity = await getAuthUser({cookies: {}} as Request);
    expect(identity).toBe(null);
  });

  test('getAuthUser with cookie', async () => {
    const req = {
      cookies: {
        talentbook_authtoken: JSON.stringify({name: 'max', fullName: 'Max Muster'})
      }
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'User') {
        return {
          findOne: () => ({name: 'max', fullName: 'Max Muster'})
        }  
      }
    });
    const identity = await getAuthUser(req as Request);
    expect(identity).toBeDefined();
    if (identity === null) {
      throw Error();
    }
    expect(identity.name).toBe('max');
    expect(identity.fullName).toBe('Max Muster');
  });

  test('setAuthCookie test', async () => {
    const token : string|undefined = undefined;
    const req = {
      cookies: {
        talentbook_authtoken: token
      }
    };
    const res: Partial<Response> = {
      cookie: jest.fn().mockImplementation((key, value, options) => {
        req.cookies.talentbook_authtoken = value;
      })
    };
    await setAuthCookie(res as Response, 'max', 'Max Muster');
    expect(req.cookies.talentbook_authtoken).toBeDefined();
    expect(mocked(res.cookie)?.mock.calls.length).toBe(1);
    expect(req.cookies.talentbook_authtoken).toBe(JSON.stringify({name: 'max', fullName: 'Max Muster'}));
  });

  test('deleteAuthCookie test', async () => {
    const req = { cookies: {
      talentbook_authtoken: <string|undefined>'token'
    }};
    const res: Partial<Response> = {
      clearCookie: jest.fn().mockImplementation((key) => {
        req.cookies.talentbook_authtoken = undefined;
        delete req.cookies.talentbook_authtoken;
      })
    };
    deleteAuthCookie(res as Response);
    expect(req.cookies.talentbook_authtoken).toBeUndefined();
  });
});

