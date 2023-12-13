import { workerData } from 'worker_threads';
import nodemailer from 'nodemailer';
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

//export
let email = workerData.email;
let otp = workerData.otp;
let htmltemplate = workerData.template;
let subject = workerData.subject;

const templatePath = path.join(__dirname, htmltemplate);
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
})

var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: html,
};

transporter.sendMail(mailOptions)