const mongoose = require("mongoose");

const connectedDb = async()=>{
     try{
        await mongoose.connect("mongodb+srv://user2002:vishal2002:@cluster0.hty7hh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("connected to mongo db..");
    }
     catch{
        console.log("connection error...");
     }
}  

module.exports = connectedDb;