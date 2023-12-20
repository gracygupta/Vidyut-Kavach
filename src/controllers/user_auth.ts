import User from "../models/user";
import Role from "../models/roles";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
// import Otp from "../models/otp";
import jwt from "jsonwebtoken";
import * as QRCode from "qrcode";
import AccessLog from "../models/access_logs";
import { encrypt, decrypt } from "../middlewares/ecryption";

const SECRET_KEY = process.env.SECRET_KEY || 'vidyut';

function generateOTP(inputString: string) {
  // Define the letters to count
  const lettersToCount = ['1', '2', '6', '7', '5', '9'];

  // Initialize an object to store letter counts
  const letterCounts: any = {};

  // Iterate through the inputString and count the letters
  for (const letter of inputString) {
    if (lettersToCount.includes(letter)) {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }
  }

  let otp = '';

  for (const letter of lettersToCount) {
    const count = letterCounts[letter] || 0;
    otp +=  (count % 10).toString();

  }

  return otp;
}

function generateQRCode(data: any): Promise<string> {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(data, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}

const signUp = async (req: Request, res: Response) => {
  try {
    const { empID, username, email, role, password } = req.body;
    const about = req.body.about || "";
    const hashedPassword = await bcrypt.hash(password, 10);
    const roleID = await Role.findOne({ name: role });
    if (!roleID) {
      return res.status(400).json({
        success: false,
        message: "role does not exist",
      });
    }
    await User.create({
      empID: empID,
      username: username,
      email: email,
      about: about,
      role: roleID?._id,
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
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const verifyCredentials = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { empID, password } = req.body;
    const user = await User.findOne({ empID: empID });
    if (!user)
      return res.status(500).json({
        success: false,
        message: "invalid credentials",
      });
    const matchPassword = await bcrypt.compare(password, user.password);
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
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    var { empID, otp } = req.body;
    otp = parseInt(otp);
    const user = await User.findOne({ empID: empID });
    if (user) {

      const currentDate = new Date();
      const day = currentDate.getDate(); // Day of the month (1-31)
      const month = currentDate.getMonth() + 1; // Month (0-11, so we add 1 to make it 1-12)
      const year = currentDate.getFullYear(); // Year (e.g., 2023)
      const hours = currentDate.getHours(); // Hours (0-23)
      const minutes = currentDate.getMinutes();


      const data = user?.empID + user?.password+day+month+year+hours+minutes;
      // const update = encrypt(data);
      const generatedOtp = generateOTP(data);
      console.log("generatedOTP: ",generatedOtp);
      const role = await Role.findOne({_id: user.role});
      const token = jwt.sign(
        { role: role?.name, id: user._id, email: user.email },
        SECRET_KEY
      );
      if (otp == generatedOtp) {
        await AccessLog.create({
          empID: user.empID,
          role: role?.name,
          ip: req.ip,
          login: true,
          timestamp: new Date().toISOString()
        });
        return res.status(200).json({
          success: true,
          role: role?.name,
          username: user.username,
          token: token,
          otp: generatedOtp
        });
      } else {
        await AccessLog.create({
          empID: user.empID,
          role: role?.name,
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export { signUp, verifyCredentials, verifyOtp };
