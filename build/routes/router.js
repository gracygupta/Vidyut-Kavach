"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const admin_1 = __importDefault(require("../routes/admin"));
const user_1 = __importDefault(require("../routes/user"));
router.use("/admin", admin_1.default);
router.use("/user", user_1.default);
exports.default = router;
