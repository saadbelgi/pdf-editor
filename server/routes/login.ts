import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dataSource from '../database/dataSource';
import { User } from '../database/models/User';
import { validateEmail, validatePassword } from '../utils/validate';

const router = Router();
const secret = process.env.JWT_SECRET
  ? process.env.JWT_SECRET
  : 'MY_LITTLE_SECRET';

router.post('/', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!validateEmail(email) || !validatePassword(password)) {
    res.json({
      success: false,
      message: 'Missing or invalid email or password',
    });
  }

  const user = await dataSource
    .getRepository(User)
    .findOne({ where: { email: email } });

  if (user === null) {
    res.json({ success: false, message: 'Account does not exist' });
  } else {
    const success = await bcrypt.compare(password, user.password.toString());
    if (success) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        secret,
        { expiresIn: '24h' }
      );
      console.log(token);
      res.cookie('token', token, {
        maxAge: 24 * 60 * 60,
        // signed: true,
        path: '/',
        httpOnly: false
      });
      res.json({ success: true, message: 'Logged in', token });
    } else {
      res.json({ success: false, message: 'Invalid password' });
    }
  }
});

export default router;
