import express, { Request, Response } from "express";
import dbConnect from "./db/conn";
import { json, urlencoded } from "body-parser";
import rateLimit from "express-rate-limit";
import logger from "morgan";
import cors from "cors";
import createError from "http-errors";

const app = express();
const PORT = process.env.PORT || 5000;
dbConnect();

//rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 2500, // limit each IP to 400 requests per windowMs
});
app.use(limiter);

//Cors Policy
app.use(
  cors({
    origin: "*",
  })
);

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(logger("dev"));
app.get("/", (req: Request, res: Response): Response => {
  return res.status(200).json({ message: "connected to server" });
});

// app.use("/",router);

//NOT found page
app.use((req, res) => {
  res.status(404).json({ message: "404 Not Found" });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.listen(PORT, (): void => {
  console.log(`Server is up at port ${PORT}`);
});
