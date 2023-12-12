"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const express_validator_1 = require("express-validator");
const reqValidator_1 = require("../middlewares/reqValidator");
// @route   POST /signup
// @desc    Register user and return jwt and user object
// @access  Public
router.post("/signup", [
    (0, express_validator_1.body)("empId", "Employee ID missing.").exists().isString().custom(reqValidator_1.isEmpIdUnique),
    (0, express_validator_1.body)("username", "Name should be at least 5 characters.")
        .exists()
        .isString()
        .isLength({ min: 5 }),
    (0, express_validator_1.body)("email", "Email is required.")
        .exists()
        .isEmail()
        .custom(reqValidator_1.isEmailUnique),
    (0, express_validator_1.body)("role", "Role is not specified.").exists().isString().custom(reqValidator_1.isCorrectRole),
    (0, express_validator_1.body)("password", "Password should be at least 2 characters.")
        .exists()
        .isLength({ min: 6 }),
]);
// @route   POST /signin
// @desc    Login user and return jwt and user object
// @access  Public
router.post("/signin", [
    (0, express_validator_1.body)("email", "Email is required.")
        .exists()
        .isEmail(),
    // .custom(utilController.isUserExist),
    (0, express_validator_1.body)("password", "Password is required.")
        .exists()
]);
