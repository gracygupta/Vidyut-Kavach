import express, {Request, Response} from 'express';
// import {router} from "./router/routes";
import dbConnect from './db/conn'; 
import {json ,urlencoded} from 'body-parser';

const app = express();
const PORT = process.env.PORT || 5000;
dbConnect();

app.use(json());
app.use(urlencoded({extended:true}));
app.get("/",(req:Request,res:Response):Response=>{
    return res.json({"message":"connected to server"});
})

// app.use("/",router);

app.listen(PORT, ():void=>{
    console.log(`Server is up at port ${PORT}`);
});