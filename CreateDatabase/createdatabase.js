const movieData = require("../Data/moviesdata");
const movieModel = require("../Models/MoviesModel");
const tvseriesData = require("../Data/tvseriesdata");
const tvseriesModel = require("../Models/TvseriesModel");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

//connect to mongodb database
const DATABASE_URL = `${process.env.MONGO_URL}`;
mongoose.connect(DATABASE_URL,{useNewUrlParser:true,useUnifiedTopology:true});
const db = mongoose.connection();
db.on("error",(err)=>console.log(err));
db.once("open",()=>console.log("db is created"));

//function to create movie database
const createmovieDatabase = async()=>{
     await movieModel.deleteMany({});
     await movieModel.insertMany(movieData);
     console.log("success");
}

//function to create tvseries database
const createtvseriesDatabase = async()=>{
     await tvseriesModel.deleteMany({});
     await tvseriesModel.insertMany(tvseriesData);
     await mongoose.disconnect();
     console.log("success");
}

//creating movie database
createmovieDatabase();

//creating tvseries database
createtvseriesDatabase();