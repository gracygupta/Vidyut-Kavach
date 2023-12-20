"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin = express_1.default.Router();
const express_validator_1 = require("express-validator");
const reqValidator_1 = require("../middlewares/reqValidator");
const user_auth_1 = require("../controllers/user_auth");
const miscellaneous_1 = require("../controllers/miscellaneous");
const check_role_1 = require("../middlewares/check_role");
// @route   POST /get_privileges
// @desc    get all privileges
// @access  Public
admin.get("/get_privileges", check_role_1.checkToken, check_role_1.check_admin, miscellaneous_1.get_privileges);
// @route   POST /add_privilege
// @desc    add privileges for roles
// @access  Admin
admin.post("/add_privilege", check_role_1.checkToken, check_role_1.check_admin, [
    (0, express_validator_1.body)("name", "name is required").exists().isString()
], reqValidator_1.validateRequest, miscellaneous_1.add_privilege);
// @route   POST /add_role
// @desc    add user role and privileges
// @access  Admin
admin.post("/add_role", check_role_1.checkToken, check_role_1.check_admin, [
    (0, express_validator_1.body)("name", "name of role is required").exists(),
    (0, express_validator_1.body)("privileges", "select privileges").exists().isArray()
], reqValidator_1.validateRequest, miscellaneous_1.add_role);
// @route   POST /get_role
// @desc    get all roles
// @access  Public
admin.get("/get_roles", check_role_1.checkToken, check_role_1.check_admin, miscellaneous_1.get_roles);
// @route   POST /signup
// @desc    Register user
// @access  Admin
admin.post("/signup", check_role_1.checkToken, check_role_1.check_admin, [
    (0, express_validator_1.body)("empID", "Employee ID missing.")
        .exists()
        .isString()
        .custom(reqValidator_1.isEmpIdUnique),
    (0, express_validator_1.body)("username", "Name should be at least 5 characters.")
        .exists()
        .isString()
        .isLength({ min: 5 }),
    (0, express_validator_1.body)("email", "Email is required.")
        .exists()
        .isEmail()
        .custom(reqValidator_1.isEmailUnique),
    (0, express_validator_1.body)("role", "Role is not specified.")
        .exists()
        .isString(),
    (0, express_validator_1.body)("password", "Password should be at least 2 characters.")
        .exists()
        .isLength({ min: 6 }),
], reqValidator_1.validateRequest, user_auth_1.signUp);
exports.default = admin;
