import { Worker } from "worker_threads";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Otp from "../models/otp";

import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
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

const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const otp = generateOtp();
    const email = req.body.user.email;
    const otpExpiresAt = new Date(+new Date() + 15 * 60 * 1000);
    await Otp.create({
      empID: req.body.user.empID,
      otp: otp,
      otpExpiresAt: otpExpiresAt,
    })
      .then(() => {
        const templatePath = path.join(__dirname, "emailTemplate/otp.html");
        // Compile the Handlebars template
        const source = fs.readFileSync(templatePath, "utf8");
        const template = handlebars.compile(source);

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
          if (!error) {
            console.log("Email sent" + info.response);
            return res.status(200).json({
              status: true,
              email: email,
              message: "email sent successfully",
            });
          } else {
            console.log(error);
            return res.status(500).json({
              status: false,
              message: "some error occured",
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          status: false,
          message: "some error occured",
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { sendOTP };
