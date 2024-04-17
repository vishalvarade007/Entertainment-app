const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const cookieParaser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const uri = "mongodb+srv://user2002:vishal2002@cluster0.hty7hh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.set("strictQuery",false);

//env config
dotenv.config();

//router import
const userRoutes = require("./Routes/userRoutes");
const appdataRoutes = require("./Routes/appdataroutes");
const searchRoutes = require("./Routes/searchroutes");
const morgan = require("morgan");




//middlewares
app.use(cors({
    credentials:true
}));

app.use(express.json());
app.use(logger("dev"));
app.use(cookieParaser());

//routes
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/data",appdataRoutes);
app.use("/api/v1/data",searchRoutes);

const port = 8080;

//mongo connection and starting server
mongoose
   .connect(uri)
   .then(()=>console.log("connected to db.."))
   .then(()=>app.listen(port,()=>console.log("server is listening...")))
   .catch((err)=>console.log("connection error !!"));