"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signup_1 = __importDefault(require("./signup"));
const login_1 = __importDefault(require("./login"));
const savefile_1 = __importDefault(require("./savefile"));
const yourfiles_1 = __importDefault(require("./yourfiles"));
const deletefile_1 = __importDefault(require("./deletefile"));
const renamefile_1 = __importDefault(require("./renamefile"));
const downloadfile_1 = __importDefault(require("./downloadfile"));
const router = (0, express_1.Router)();
router.use('/signup', signup_1.default);
router.use('/login', login_1.default);
router.use('/savefile', savefile_1.default);
router.use('/yourfiles', yourfiles_1.default);
router.use('/deletefile', deletefile_1.default);
router.use('/renamefile', renamefile_1.default);
router.use('/downloadfile', downloadfile_1.default);
router.all('*', (_, res) => {
    res.status(404).send({ sucess: false, message: 'Endpoint does not exist' });
});
exports.default = router;
