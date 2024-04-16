const express = require("express");
const router = express.Router();
const {moviesearch,seriessearch,multisearch,bookmarksearch} = require("../Controllers/searchControllers");
const {verifyToken} = require("../Middleware/jwtauth");

//searching movie by query
router.get("/movie/search/:query",moviesearch);

//searching series by query
router.get("/series/search/:query",seriessearch);

//searching movie and series together by query
router.get("/all/search/:query",multisearch);

//bookmark search by query(requires token verification)
router.get("/bookmark/search/:query",verifyToken,bookmarksearch);

module.exports = router;