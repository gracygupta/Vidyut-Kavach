"use strict";
const workerData = require('worker_threads');
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
//export
let email = workerData.email;
let otp = workerData.otp;
let htmltemplate = workerData.template;
let subject = workerData.subject;
console.log(htmltemplate);
const templatePath = path.join(__dirname, "otp.html");
console.log(templatePath);
// Compile the Handlebars template
const source = fs.readFileSync(templatePath, "utf8");
const template = handlebars.compile(source);
const variables = {
    otp: otp
};
// Generate the HTML content using the variables and template
const html = template(variables);
const transporter = nodemailer.createTransport({
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
    subject: subject,
    html: html,
};
transporter.sendMail(mailOptions);
