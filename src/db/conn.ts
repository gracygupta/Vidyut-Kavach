import mongoose, { connect } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const uri = process.env.DB_URI;

function dbConnect() {
  mongoose.set("strictQuery", true);

  //connecting with db
  mongoose
    .connect(`${uri}`)
    .then(() => {
      console.log("Connection Successful");
    })
    .catch((err) => console.log(err));
}

export default dbConnect;