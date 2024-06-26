"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY ? process.env.SECRET_KEY : 'vidyut';
const validateRequest = (req, res, next) => {
    try {
        const token = req.headers.token;
        if (token) {
            const user = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            req.user = user;
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
};
exports.default = validateRequest;
