"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dataSource_1 = __importDefault(require("../database/dataSource"));
const User_1 = require("../database/models/User");
const validate_1 = require("../utils/validate");
const router = (0, express_1.Router)();
const jwt_secret = process.env.JWT_SECRET
    ? process.env.JWT_SECRET
    : 'MY_LITTLE_SECRET';
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    if (!(0, validate_1.validateEmail)(email) || !(0, validate_1.validatePassword)(password)) {
        res.json({
            success: false,
            message: 'Missing or invalid email or password',
        });
    }
    const existingUser = await dataSource_1.default
        .getRepository(User_1.User)
        .findOne({ where: { email: email } });
    if (existingUser === null) {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        let user = new User_1.User();
        user.email = email;
        user.password = Buffer.from(hashedPassword, 'utf-8');
        user = await dataSource_1.default.getRepository(User_1.User).save(user);
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
        }, jwt_secret, { expiresIn: '24h' });
        res.cookie('token', token, {
            maxAge: 24 * 60 * 60,
            signed: true,
            path: '/',
        });
        res.json({ success: true, message: 'Signed up successfully' });
    }
    else {
        res.json({ success: false, message: 'Email already exists' });
    }
});
exports.default = router;
