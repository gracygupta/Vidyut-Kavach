"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.isCorrectRole = exports.isEmpIdUnique = exports.isEmailUnique = void 0;
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const roles_1 = __importDefault(require("../models/roles"));
// Custom validation function to check if the email already exists
const isEmailUnique = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_1.default.findOne({ email: email });
    if (existingUser) {
        throw new Error("user already exists.");
    }
});
exports.isEmailUnique = isEmailUnique;
const isEmpIdUnique = (empID) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_1.default.findOne({ empID: empID });
    if (existingUser) {
        throw new Error("user already exist");
    }
});
exports.isEmpIdUnique = isEmpIdUnique;
const isCorrectRole = (role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingRole = yield roles_1.default.findById(role);
        if (!existingRole) {
            throw new Error("Role does not exist");
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.isCorrectRole = isCorrectRole;
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            errors: errors.array(),
        });
    }
    else {
        next();
    }
};
exports.validateRequest = validateRequest;
