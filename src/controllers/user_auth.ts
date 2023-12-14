import User from '../models/user';
import Role from '../models/roles';
import bcrypt from 'bcryptjs';
import {Request, Response, NextFunction} from 'express';
import Otp from '../models/otp';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY? process.env.SECRET_KEY: 'vidyut';

const signUp = async (req:Request, res:Response) =>{
    try{
        const {empID, username, email, role, password} = req.body;
        const about = req.body.about || "";
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            empID : empID,
            username: username,
            email: email,
            about: about,
            role: role,
            password: hashedPassword
        }).then(data=>{
            return res.status(200).json({
                success: true,
                message: "user created successfully"
            })
        }).catch(err=>{
            console.log(err);
            return res.status(500).json({
                success: false,
                message:"some error occured"
            })
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message:"Internal Server Error"
        })
    }
}

const verifyCredentials = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {empID, password} = req.body;
        const user = await User.findOne({empID: empID});
        if(!user) return res.status(500).json({
            success: false,
            message: "invalid credentials"
        });
        // if(!user.isVerified) return res.status(500).json({
        //     success: false,
        //     message: "email not verified"
        // });
        const matchPassword = await bcrypt.compare(password, user.password);
        if(!matchPassword) return res.status(500).json({
            success: false,
            message: "invalid credentials"
        });
        req.body.user = user;
        next();
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message:"Internal Server Error"
        })
    }
}

const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { empID, otp } = req.body;

    const otpData = await Otp.findOne({ empID }).sort({ _id: -1 });
    if (otpData && otp === otpData.otp && otpData.otpExpiresAt >= new Date()) {
      const user = await User.findOne({ empID });

      if (user) {
        var role = await Role.findById(user.role);
        var roleName;
        if (role && role.name) {
            roleName = role.name;
          }
        const token = jwt.sign(
          { email: user.email, empID: user.empID, _id: user._id, role: roleName },
          SECRET_KEY
        );

        return res.status(200).json({
          success: true,
          token,
          role: roleName,
        });
      }
    } else {
      return res.status(500).json({
        success: false,
        message: "Incorrect OTP or expired",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { signUp, verifyCredentials, verifyOtp };