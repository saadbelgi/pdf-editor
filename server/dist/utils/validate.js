"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.validateEmail = void 0;
const emailRe = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
const passwordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@~`!@#$%^&*()-=_+[\]\\{}|;':",./<>?])[A-Za-z\d@~`!@#$%^&*()-=_+[\]\\{}|;':",./<>?]+$/;
function validateEmail(email) {
    return (typeof email === 'string' &&
        email.length <= 254 &&
        email.length >= 3 &&
        emailRe.test(email));
}
exports.validateEmail = validateEmail;
function validatePassword(password) {
    return (typeof password === 'string' &&
        password.length >= 8 &&
        password.length <= 30 &&
        passwordRe.test(password));
}
exports.validatePassword = validatePassword;
