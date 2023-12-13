const Worker = require('worker_threads');
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Otp from "../models/otp";

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
    }).then(() => {
          new Worker("./src/controllers/sendEmail.ts", { 
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
    
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export {sendOTP};
