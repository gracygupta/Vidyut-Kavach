import { Request as ExpressRequest, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define a custom Request type
interface CustomRequest extends ExpressRequest {
    user?: any; // Add the user property to Request
}

const SECRET_KEY = process.env.SECRET_KEY ? process.env.SECRET_KEY : 'vidyut';

const checkToken = (req: CustomRequest, res: Response, next: NextFunction) => {
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

// const check_admin = (req: Request, res: Response, next: NextFunction)=>{
//     try{
//         const role = req.body.user.role;
//     }
//     catch(err){
//         console.log(err);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         })
//     }
// }

export default checkToken;
