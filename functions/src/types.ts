import {Request} from 'express';

export interface CustomRequest extends Request {
  userUid: string;
  admin: boolean;
  headers: {
    authorization: string;
  };
}
