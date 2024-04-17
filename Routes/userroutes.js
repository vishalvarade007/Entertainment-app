const express = require("express");
const router = express.Router();
const {registeruserController,loginuserController,logoutuserController} = require("../Controllers/userControllers");
const {verifyToken} = require("../Middleware/jwtauth");

//to handle user registration
router.post("/register",registeruserController);

//to handle user login
router.post("/login",loginuserController);

//to handle user logout
router.get("/logout",verifyToken,logoutuserController);

module.exports = router;