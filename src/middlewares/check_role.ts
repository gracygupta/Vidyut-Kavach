import { Request as ExpressRequest, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

// Define a custom Request type
interface CustomRequest extends ExpressRequest {
    user?: any; // Add the user property to Request
}

const SECRET_KEY = process.env.SECRET_KEY ? process.env.SECRET_KEY : 'vidyut';

const checkToken = async(req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.token as string;

        if (token) {
            const user = jwt.verify(token, SECRET_KEY);
            req.body.user = user;
            console.log(user);
            next();
        } else {
            res.status(401).json({
                success: false,
                message: 'Unauthorized: Token not provided',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

const check_admin = async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try{
        const role = req.body.user.id;
        if (role == "admin"){
            next()
        }
        return res.status(400).json({
            success: false,
            message: 'Unauthorized: Token not provided',
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


const check_security_analyst = (req: CustomRequest, res: Response, next: NextFunction)=>{
    try{
        const role = req.body.user.role;
        if (role == "security analyst" || role == "admin"){
            next()
        }
        return res.status(400).json({
            success: false,
            message: 'Unauthorized: Token not provided',
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const check_maintenance_technical = (req: CustomRequest, res: Response, next: NextFunction)=>{
    try{
        const role = req.body.user.role;
        if (role == "maintenance technician" || role =="admin"){
            next()
        }
        return res.status(400).json({
            success: false,
            message: 'Unauthorized: Token not provided',
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const check_system_operator = (req: CustomRequest, res: Response, next: NextFunction)=>{
    try{
        const role = req.body.user.role;
        if (role == "system operator" || role =="admin"){
            next()
        }
        return res.status(400).json({
            success: false,
            message: 'Unauthorized: Token not provided',
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export  {checkToken, check_admin,check_security_analyst,check_maintenance_technical, check_system_operator };
