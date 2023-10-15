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
const secret = process.env.JWT_SECRET
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
    const user = await dataSource_1.default
        .getRepository(User_1.User)
        .findOne({ where: { email: email } });
    if (user === null) {
        res.json({ success: false, message: 'Account does not exist' });
    }
    else {
        const success = await bcrypt_1.default.compare(password, user.password.toString());
        if (success) {
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
            }, secret, { expiresIn: '24h' });
            console.log(token);
            res.cookie('token', token, {
                maxAge: 24 * 60 * 60,
                // signed: true,
                path: '/',
                httpOnly: false
            });
            res.json({ success: true, message: 'Logged in', token });
        }
        else {
            res.json({ success: false, message: 'Invalid password' });
        }
    }
});
exports.default = router;
