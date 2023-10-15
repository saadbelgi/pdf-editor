"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || 'fallback secret';
function auth(req, res, next) {
    console.log(req.signedCookies);
    console.log(req.cookies);
    if (!req.cookies || !req.cookies.token) {
        res.status(401).json({ sucess: false, message: 'Not authorized' });
    }
    else {
        const payload = jsonwebtoken_1.default.verify(req.cookies.token, secret);
        console.log(payload);
        //@ts-ignore
        req['user'] = { id: payload.id, email: payload.email };
        next();
    }
}
exports.default = auth;
