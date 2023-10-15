"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataSource_1 = __importDefault(require("../database/dataSource"));
const SavedFile_1 = require("../database/models/SavedFile");
const auth_1 = __importDefault(require("../utils/auth"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
router.post('/', auth_1.default, async (req, res) => {
    var _a;
    const { fileId } = req.body;
    const file = await dataSource_1.default
        .getRepository(SavedFile_1.SavedFile)
        .findOne({ where: { id: fileId }, relations: { owner: true } });
    if (!file) {
        res.json({ success: false, message: "File with given ID doesn't exist" });
    }
    else if (file.owner.id !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        res.status(403).json({ success: false, message: 'Unauthorized user' });
    }
    else {
        fs_1.default.unlink(path_1.default.join(file.destinationFolder, file.fileName), (err) => console.error(err));
        await dataSource_1.default.getRepository(SavedFile_1.SavedFile).delete(file.id);
        res.json({ success: true, message: 'File deleted successfully' });
    }
});
exports.default = router;
