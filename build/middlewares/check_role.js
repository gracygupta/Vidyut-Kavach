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
exports.check_system_operator = exports.check_maintenance_technical = exports.check_security_analyst = exports.check_admin = exports.checkToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY ? process.env.SECRET_KEY : 'vidyut';
const checkToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.token;
        if (token) {
            const user = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            req.body.user = user;
            console.log(user);
            next();
        }
        else {
            res.status(401).json({
                success: false,
                message: 'Unauthorized: Token not provided',
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
});
exports.checkToken = checkToken;
const check_admin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = req.body.user.id;
        if (role == "admin") {
            next();
        }
        return res.status(400).json({
            success: false,
            message: 'Unauthorized: Token not provided',
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.check_admin = check_admin;
const check_security_analyst = (req, res, next) => {
    try {
        const role = req.body.user.role;
        if (role == "security analyst" || role == "admin") {
            next();
        }
        return res.status(400).json({
            success: false,
            message: 'Unauthorized: Token not provided',
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.check_security_analyst = check_security_analyst;
const check_maintenance_technical = (req, res, next) => {
    try {
        const role = req.body.user.role;
        if (role == "maintenance technician" || role == "admin") {
            next();
        }
        return res.status(400).json({
            success: false,
            message: 'Unauthorized: Token not provided',
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.check_maintenance_technical = check_maintenance_technical;
const check_system_operator = (req, res, next) => {
    try {
        const role = req.body.user.role;
        if (role == "system operator" || role == "admin") {
            next();
        }
        return res.status(400).json({
            success: false,
            message: 'Unauthorized: Token not provided',
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.check_system_operator = check_system_operator;
