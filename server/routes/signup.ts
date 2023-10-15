import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dataSource from '../database/dataSource';
import { User } from '../database/models/User';
import { validateEmail, validatePassword } from '../utils/validate';

const router = Router();
const jwt_secret = process.env.JWT_SECRET
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

  const existingUser = await dataSource
    .getRepository(User)
    .findOne({ where: { email: email } });

  if (existingUser === null) {
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = new User();
    user.email = email;
    user.password = Buffer.from(hashedPassword, 'utf-8');
    user = await dataSource.getRepository(User).save(user);
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      jwt_secret,
      { expiresIn: '24h' }
    );
    res.cookie('token', token, {
      maxAge: 24 * 60 * 60,
      signed: true,
      path: '/',
    });
    res.json({ success: true, message: 'Signed up successfully' });
  } else {
    res.json({ success: false, message: 'Email already exists' });
  }
});

export default router;
