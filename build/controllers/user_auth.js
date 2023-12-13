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
exports.verifyOtp = exports.verifyCredentials = exports.signUp = void 0;
const user_1 = __importDefault(require("../models/user"));
const roles_1 = __importDefault(require("../models/roles"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const otp_1 = __importDefault(require("../models/otp"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY ? process.env.SECRET_KEY : 'vidyut';
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { empID, username, email, role, password } = req.body;
        const about = req.body.about || "";
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield user_1.default.create({
            empID: empID,
            username: username,
            email: email,
            about: about,
            role: role,
            password: hashedPassword
        }).then(data => {
            return res.status(200).json({
                success: true,
                message: "user created successfully"
            });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "some error occured"
            });
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.signUp = signUp;
const verifyCredentials = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { empID, password } = req.body;
        const user = yield user_1.default.findOne({ empID: empID });
        if (!user)
            return res.status(500).json({
                success: false,
                message: "invalid credentials"
            });
        // if(!user.isVerified) return res.status(500).json({
        //     success: false,
        //     message: "email not verified"
        // });
        const matchPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!matchPassword)
            return res.status(500).json({
                success: false,
                message: "invalid credentials"
            });
        req.body.user = user;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.verifyCredentials = verifyCredentials;
const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { empID, otp } = req.body;
        const otpData = yield otp_1.default.findOne({ empID }).sort({ _id: -1 });
        if (otpData && otp === otpData.otp && otpData.otpExpiresAt >= new Date()) {
            const user = yield user_1.default.findOne({ empID });
            if (user) {
                var role = yield roles_1.default.findById(user.role);
                var roleName;
                if (role && role.name) {
                    roleName = role.name;
                }
                const token = jsonwebtoken_1.default.sign({ email: user.email, empID: user.empID, _id: user._id }, SECRET_KEY);
                return res.status(200).json({
                    success: true,
                    token,
                    role: roleName,
                });
            }
        }
        else {
            return res.status(500).json({
                success: false,
                message: "Incorrect OTP or expired",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.verifyOtp = verifyOtp;
