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
exports.sendOTP = void 0;
const worker_threads_1 = require("worker_threads");
const otp_1 = __importDefault(require("../models/otp"));
function generateOtp() {
    // Generate a random 4-digit number
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
}
const sendOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otp = generateOtp();
        const email = req.body.user.email;
        const otpExpiresAt = new Date(+new Date() + 15 * 60 * 1000);
        yield otp_1.default.create({
            empID: req.body.user.empID,
            otp: otp,
            otpExpiresAt: otpExpiresAt,
        }).then(() => {
            new worker_threads_1.Worker("./src/controllers/sendEmail.ts", {
                workerData: { email: email, otp: otp, template: "emailTemplate/otp.html", subject: "One Time Password (OTP)" },
            });
            return res.status(200).json({
                status: true,
                email: email,
                message: "email sent successfully",
            });
        })
            .catch((err) => {
            console.log(err);
            return res.status(500).json({
                status: false,
                message: "some error occured",
            });
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.sendOTP = sendOTP;
