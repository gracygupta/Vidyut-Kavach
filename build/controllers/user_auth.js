"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// import Otp from "../models/otp";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const QRCode = __importStar(require("qrcode"));
const access_logs_1 = __importDefault(require("../models/access_logs"));
const SECRET_KEY = process.env.SECRET_KEY || 'vidyut';
function generateOTP(inputString) {
    // Define the letters to count
    const lettersToCount = ['1', '2', '6', '7', '5', '9'];
    // Initialize an object to store letter counts
    const letterCounts = {};
    // Iterate through the inputString and count the letters
    for (const letter of inputString) {
        if (lettersToCount.includes(letter)) {
            letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        }
    }
    let otp = '';
    for (const letter of lettersToCount) {
        const count = letterCounts[letter] || 0;
        otp += (count % 10).toString();
    }
    return otp;
}
function generateQRCode(data) {
    return new Promise((resolve, reject) => {
        QRCode.toDataURL(data, (err, url) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(url);
            }
        });
    });
}
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { empID, username, email, role, password } = req.body;
        const about = req.body.about || "";
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const roleID = yield roles_1.default.findOne({ name: role });
        if (!roleID) {
            return res.status(400).json({
                success: false,
                message: "role does not exist",
            });
        }
        yield user_1.default.create({
            empID: empID,
            username: username,
            email: email,
            about: about,
            role: roleID === null || roleID === void 0 ? void 0 : roleID._id,
            password: hashedPassword,
        })
            .then((data) => {
            let qrInfo = {
                empID: empID,
                id: data._id,
                key: data.empID + hashedPassword,
                username: username,
                role: role,
            };
            const updatedqrInfo = JSON.stringify(qrInfo);
            console.log(updatedqrInfo);
            // const encryptedData = encrypt(updatedqrInfo);
            generateQRCode(updatedqrInfo)
                .then((url) => {
                return res.status(200).json({
                    success: true,
                    message: "user created successfully",
                    data: url,
                });
            })
                .catch((error) => {
                console.error("Error generating QR Code:", error);
                return res.status(400).json({
                    success: false,
                    message: "some error occured",
                });
            });
        })
            .catch((err) => {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "some error occured",
            });
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
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
                message: "invalid credentials",
            });
        const matchPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!matchPassword)
            return res.status(500).json({
                success: false,
                message: "invalid credentials",
            });
        else {
            return res.status(200).json({
                success: true,
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.verifyCredentials = verifyCredentials;
const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var { empID, otp } = req.body;
        otp = parseInt(otp);
        const user = yield user_1.default.findOne({ empID: empID });
        if (user) {
            const currentDate = new Date();
            const day = currentDate.getDate(); // Day of the month (1-31)
            const month = currentDate.getMonth() + 1; // Month (0-11, so we add 1 to make it 1-12)
            const year = currentDate.getFullYear(); // Year (e.g., 2023)
            const hours = currentDate.getHours(); // Hours (0-23)
            const minutes = currentDate.getMinutes();
            const data = (user === null || user === void 0 ? void 0 : user.empID) + (user === null || user === void 0 ? void 0 : user.password) + day + month + year + hours + minutes;
            // const update = encrypt(data);
            const generatedOtp = generateOTP(data);
            console.log("generatedOTP: ", generatedOtp);
            const role = yield roles_1.default.findOne({ _id: user.role });
            const token = jsonwebtoken_1.default.sign({ role: role === null || role === void 0 ? void 0 : role.name, id: user._id, email: user.email }, SECRET_KEY);
            if (otp == generatedOtp) {
                yield access_logs_1.default.create({
                    empID: user.empID,
                    role: role === null || role === void 0 ? void 0 : role.name,
                    ip: req.ip,
                    login: true,
                    timestamp: new Date().toISOString()
                });
                return res.status(200).json({
                    success: true,
                    role: role === null || role === void 0 ? void 0 : role.name,
                    username: user.username,
                    token: token,
                    otp: generatedOtp
                });
            }
            else {
                yield access_logs_1.default.create({
                    empID: user.empID,
                    role: role === null || role === void 0 ? void 0 : role.name,
                    ip: req.ip,
                    login: false,
                    timestamp: new Date().toISOString()
                });
                return res.status(400).json({
                    success: false,
                    message: "incorrect OTP",
                });
            }
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.verifyOtp = verifyOtp;
