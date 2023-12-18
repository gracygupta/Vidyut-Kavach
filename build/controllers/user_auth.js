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
const crypto_1 = __importDefault(require("crypto"));
const roles_1 = __importDefault(require("../models/roles"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const QRCode = __importStar(require("qrcode"));
const aes_encryption_1 = require("../middlewares/aes_encryption");
const SECRET_KEY = process.env.SECRET_KEY ? process.env.SECRET_KEY : "vidyut";
function generateOTP(inputString) {
    const lowerCaseString = inputString.toLowerCase();
    const vCount = (lowerCaseString.match(/v/g) || []).length;
    const iCount = (lowerCaseString.match(/i/g) || []).length;
    const dCount = (lowerCaseString.match(/d/g) || []).length;
    const kCount = (lowerCaseString.match(/k/g) || []).length;
    const otp = vCount + iCount + dCount + kCount;
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
const create_hash = (data) => {
    const inputString = data + new Date().toISOString() + new Date().getHours() + new Date().getMinutes();
    console.log(inputString);
    const sha1Hash = crypto_1.default.createHash('sha1').update(inputString).digest('hex');
    console.log("SHA-1 Hash:", sha1Hash);
    return sha1Hash;
};
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
            role: roleID._id,
            password: hashedPassword,
        })
            .then((data) => {
            const qrInfo = {
                empID: empID,
                id: data._id,
                key: data.empID + hashedPassword,
                username: username,
                role: role,
            };
            const encryptedData = (0, aes_encryption_1.encrypt)(qrInfo);
            generateQRCode(encryptedData)
                .then((url) => {
                console.log("QR Code URL:", url);
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
        req.body.user = user;
        next();
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
        const { empID, otp } = req.body;
        const user = yield user_1.default.findOne({ empID: empID });
        if (user) {
            const data = (user === null || user === void 0 ? void 0 : user.empID) + (user === null || user === void 0 ? void 0 : user.password);
            console.log(data);
            const hash = create_hash(data);
            console.log(hash);
            const generatedOtp = generateOTP(hash);
            console.log(generatedOtp);
            if (otp == generatedOtp) {
                return res.status(200).json({
                    success: true,
                    role: user.role,
                    username: user.username,
                });
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "incorrect OTP"
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
