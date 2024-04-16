const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is required"]
    },
    password:{
        type:String,
        required :[true,"password is required"]
    },
    bookmarkmovies:[{type:mongoose.Schema.Types.ObjectId,ref:"movies"}],
    bookmarkseries:[{type:mongoose.Schema.Types.ObjectId,ref:"tvseries"}]
},{timestamps:true});

const UserModel = mongoose.model("User",UserSchema);
module.exports = UserModel;