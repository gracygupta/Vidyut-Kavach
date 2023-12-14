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
const otp_1 = __importDefault(require("../models/otp"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});
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
        })
            .then(() => {
            const templatePath = path.join(__dirname, "otp.html");
            console.log(templatePath);
            // Compile the Handlebars template
            const source = fs_1.default.readFileSync(templatePath, "utf8");
            const template = handlebars_1.default.compile(source);
            const variables = {
                otp: otp,
            };
            // Generate the HTML content using the variables and template
            const html = template(variables);
            var mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "One Time Password (OTP)",
                html: html,
            };
            transporter.sendMail(mailOptions, function (error, info) {
                console.log("Email sent" + info.response);
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
