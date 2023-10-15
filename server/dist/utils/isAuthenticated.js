"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || 'fallback secret';
function isAuthenticated(req, res, next) {
    if (!req.signedCookies || !req.signedCookies.token) {
        res.status(401).json({ error: true, message: 'Not authorized' });
    }
    else {
        jsonwebtoken_1.default.verify(req.signedCookies.token, secret);
    }
}
exports.default = isAuthenticated;
