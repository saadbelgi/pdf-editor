"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataSource_1 = __importDefault(require("../database/dataSource"));
const SavedFile_1 = require("../database/models/SavedFile");
const auth_1 = __importDefault(require("../utils/auth"));
const router = (0, express_1.Router)();
router.post('/', auth_1.default, async (req, res) => {
    var _a;
    console.log(req.body);
    const { fileId, newName } = req.body;
    console.log(fileId, newName);
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
        await dataSource_1.default.getRepository(SavedFile_1.SavedFile).save(Object.assign(Object.assign({}, file), { originalName: newName }));
        res.json({ success: true, message: 'Filename updated successfully' });
    }
});
exports.default = router;
