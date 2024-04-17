const movieData = require("../Data/moviesdata");
const movieModel = require("../Models/MoviesModel");
const tvseriesData = require("../Data/tvseriesdata");
const tvseriesModel = require("../Models/TvseriesModel");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

//connect to mongodb database
const DATABASE_URL = "mongodb+srv://user2002:vishal2002@cluster0.hty7hh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
    .connect(DATABASE_URL,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>console.log("db is created"))
    .catch((err)=>console.log(err));

//function to create movie database
exports.createmovieDatabase = async()=>{
     await movieModel.deleteMany({});
     await movieModel.insertMany(movieData);
     console.log("success");
}

//function to create tvseries database
exports.createtvseriesDatabase = async()=>{
     await tvseriesModel.deleteMany({});
     await tvseriesModel.insertMany(tvseriesData);
    
     console.log("success");
}

