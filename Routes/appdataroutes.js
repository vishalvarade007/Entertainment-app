const express = require("express");
const router = express.Router();
const {movieController,getAllData,tvseriesController,recommendedmoviesController,recommendedseriesController,trendingmoviesController,bookmarkController,setbookmarkController,checkbookmark,removebookmarkcontroller} = require("../Controllers/appdataControllers");
const {verifyToken} = require("../Middleware/jwtauth");


//get movie list
router.get("/movies",movieController);

//get tv series list
router.get("/tvseries",tvseriesController);

//get movies and tvseries together
router.get("/getall",getAllData);

//get trending movies list
router.get("/trending/movies",trendingmoviesController);

//get recommended movies list
router.get("/recommend/movies",recommendedmoviesController);

//get recommended tvseries list
router.get("/recommend/tvseries",recommendedseriesController);

//get bookmark
router.get("/bookmark",verifyToken,bookmarkController);

//check bookmark
router.get("/bookmark/check",verifyToken,checkbookmark);

//add bookmark
router.post("/bookmark/add",verifyToken,setbookmarkController);

//delete bookmark
router.delete("/bookmark/remove/:id",verifyToken,removebookmarkcontroller);

module.exports = router;