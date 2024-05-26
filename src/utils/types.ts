import { Request } from 'express';

export type JWTPayload = {
  id: string;
  role: string;
};

export type CustomRequest = Request & {
  user: JWTPayload;
};
