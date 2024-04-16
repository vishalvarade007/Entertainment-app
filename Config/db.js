const mongoose = require("mongoose");

const connectedDb = async()=>{
     try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to mongo db..");
    }
     catch{
        console.log("connection error...");
     }
}  

module.exports = connectedDb;