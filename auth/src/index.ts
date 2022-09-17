import express from "express";
import {json} from 'body-parser';
import mongoose from "mongoose";

// importing routers
import { signupRouter } from "./routes/user/signup";

const app = express();
app.use(json());

app.use(signupRouter);
 

app.listen(3000, async() => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("connected to mongodb");
  } catch (error) {
    console.error(error);
  }
  
  console.log("listening on port 3000");
});



