import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'fallback secret';
export default function auth(req: Request, res: Response, next: NextFunction) {
  console.log(req.signedCookies);
  console.log(req.cookies);
  if (!req.cookies || !req.cookies.token) {
    res.status(401).json({ sucess: false, message: 'Not authorized' });
  } else {
    const payload = jwt.verify(req.cookies.token, secret);
    console.log(payload);
    //@ts-ignore
    req['user'] = { id: payload.id, email: payload.email };
    next();
  }
}
