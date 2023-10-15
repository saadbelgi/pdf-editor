"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const dataSource_1 = __importDefault(require("../database/dataSource"));
const SavedFile_1 = require("../database/models/SavedFile");
const auth_1 = __importDefault(require("../utils/auth"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: path_1.default.resolve('./uploads'),
    filename(req, _, callback) {
        var _a;
        callback(null, ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) + '-' + Date.now() + '.pdf');
    },
});
const upload = (0, multer_1.default)({ storage });
router.post('/', auth_1.default, upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.json({ success: false, message: 'No file sent' });
    }
    else {
        const file = new SavedFile_1.SavedFile();
        file.destinationFolder = req.file.destination;
        file.size = req.file.size;
        file.fileName = req.file.filename;
        file.originalName = req.file.originalname;
        file.owner = req.user;
        dataSource_1.default.getRepository(SavedFile_1.SavedFile).save([file]);
        res.json({ success: true, message: 'File uploaded successfully' });
    }
});
exports.default = router;
