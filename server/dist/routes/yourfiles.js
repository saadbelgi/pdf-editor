"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataSource_1 = __importDefault(require("../database/dataSource"));
const User_1 = require("../database/models/User");
const auth_1 = __importDefault(require("../utils/auth"));
const router = (0, express_1.Router)();
router.get('/', auth_1.default, async (req, res) => {
    var _a;
    const user = await dataSource_1.default.getRepository(User_1.User).findOne({
        where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
        relations: { savedFiles: true },
    });
    if (user) {
        if (!user.savedFiles || user.savedFiles.length == 0) {
            res.json({ success: true, files: [] });
        }
        else {
            res.json({
                success: true,
                files: user.savedFiles.map((file) => {
                    return {
                        id: file.id,
                        originalName: file.originalName,
                        creationTime: file.creationTime,
                    };
                }),
            });
        }
    }
});
exports.default = router;
