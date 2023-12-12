"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const nodemailer_1 = __importDefault(require("nodemailer"));
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
//export
let email = worker_threads_1.workerData.email;
let otp = worker_threads_1.workerData.otp;
const templatePath = path.join(__dirname, "otp.html");
// Compile the Handlebars template
const source = fs.readFileSync(templatePath, "utf8");
const template = handlebars.compile(source);
const variables = {
    otp: otp
};
// Generate the HTML content using the variables and template
const html = template(variables);
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "One Time Password (OTP)",
    html: html,
};
transporter.sendMail(mailOptions);
