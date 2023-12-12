"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user = express_1.default.Router();
const express_validator_1 = require("express-validator");
const reqValidator_1 = require("../middlewares/reqValidator");
const user_auth_1 = require("../controllers/user_auth");
const emailController_1 = require("../controllers/emailController");
// @route   POST /signin
// @desc    login user and return jwt
// @access  Public
user.post("/signin", [
    (0, express_validator_1.body)("empID", "employee ID required").exists().isString(),
    (0, express_validator_1.body)("password", "password is required").exists().isString(),
], reqValidator_1.validateRequest, user_auth_1.verifyCredentials, emailController_1.sendOTP);
// @route   POST /verify_otp
// @desc    verify otp
// @access  Public
user.post("/verify_otp", [
    (0, express_validator_1.body)("empID", "employee ID is required").exists(),
    (0, express_validator_1.body)("otp", "otp required").exists().isNumeric()
], user_auth_1.verifyOtp);
exports.default = user;
