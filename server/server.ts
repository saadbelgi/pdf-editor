import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgran from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/index';
import 'reflect-metadata';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'saad'));
app.use(morgran('dev'));
app.use(router);

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));
