const MovieModel = require("../Models/MoviesModel");
const TvseriesModel = require("../Models/TvseriesModel");
const UserModel = require("../Models/UserModel");

//controller to get all movies
exports.MovieController = async(req,res)=>{
     try{
         const moviedata = await MovieModel.find({});

         if(!moviedata){
            return res.status(200).send({
                success:false,
                message:"No movie found"
            })
         }

         return res.status(200).send({
             moviecount:moviedata.length,
             sucess:true,
             message:"movie list",
             moviedata
         })
     }
     catch(error){
        console.error(error);
         return res.status(400).send({
            success:false,
            message:"error while getting movie list",
            error:error.message
         })
     }
};
//controller to get all tvseries
exports.TvseriesController = async(req,res)=>{
    try{
        const tvseriesdata = await TvseriesModel.find({});
        if(!tvseriesdata){
            return res.status(200).send({
                success:false,
                message:"No series found"
            })
        }

        return res.status(200).send({
            tvseriescount:tvseriesdata.length,
            success:true,
            message:"All tv series list",
            tvseriesdata
        })
    }
    catch(error){
        console.error(error);
        return res.status(400).send({
            success:false,
            message:"error while getting tv series list",
            error:error.message
        })
    }
};
//controller to get all the data(both movies and series)
exports.getAllData = async(req,res)=>{
      try{
        const movies = await MovieModel.find({});
        const series = await TvseriesModel.find({});
        const allData = [...movies,...series];

        if(allData.length === 0){
            return res.status(200).send({
                success:false,
                message:"No data found"
            })
        }

        return res.status(200).send({
            datacount:allData.length,
            success:true,
            message:"data found",
            allData
        })
      }
      catch(error){
        console.error(error);
          return res.status(400).send({
            success:false,
            message:"error while getting the data",
            error:error.message
          })
      }
};
//controller to get recommended movies
exports.recommendedmoviesController = async(req,res)=>{
     try{
        const recommendedmovies = await MovieModel.aggregate([
            {$match:{genre:{$in:["Action","Crime","Drama"]}}},
            {$sample:{size:20}}
        ])

        if(!recommendedmovies || recommendedmovies.length === 0){
            return res.status(200).send({
                success:false,
                message:"No recommended movies found"
            })
        }
        return res.status(200).send({
            moviescount:recommendedmovies.length,
            success:true,
            message:"Recommended movies list",
            recommendedmovies
        })
     }
     catch(error){
        console.error(error);
        return res.status(400).send({
            success:false,
            message:"error while getting the recommended movies data",
            error:error.message
        })
     }
};
//controller to get recommended series
exports.recommendedseriesController = async(req,res)=>{
    try{
        const recommendedseries = await TvseriesModel.aggregate([
            {$match:{genre:{$in:["Crime","Drama","Thriller"]}}},
            {$sample:{size:20}}
        ])

        if(!recommendedseries || recommendedseries.length === 0){
            return res.status(200).send({
                success:false,
                message:"No series found"
            })
        }

        return res.status(200).send({
            seriescount:recommendedseries.length,
            success:true,
            message:"recommended series list",
            recommendedseries
        })
    }
    catch(error){
        console.error(error);
        return res.status(400).send({
            success:false,
            message:"error while getting series data",
            error:error.message
        })
    }
};
//controller to get trending movies
exports.trendingmoviesController = async(req,res)=>{
    try{
        const trendingmovies = await MovieModel.find().sort({rank:1}).limit(10);

        return res.status(200).send({
            success:true,
            message:"trending movies list",
            trendingmovies
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).send({
            success:false,
            message:"Internal server error"
        })
    }
};

//controller to get user's bookmarked movies and series
 exports.bookmarkController = async(req,res)=>{
     try{
        const user = await UserModel.findById(req.userId);
        if(!user){
            return res.status(404).send({message:"User not found!"});
        }

        const bookmarkmovies = await Promise.all(user.bookmarkmovies.map(async(movieId)=>{
            const movie = await MovieModel.findById(movieId);
            return movie;
        }));

        const bookmarkseries = await Promise.all(user.bookmarkseries.map(async(tvId)=>{
            const series = await TvseriesModel.findById(tvId);
            return series;
        }));

        const newUser = {...user.toObject(),bookmarkmovie:bookmarkmovies,bookmarkseries:bookmarkseries};

        return res.status(200).send({
            success:true,
            message:"all bookmark found",
            bookmark:newUser
        })
     }
     catch(error){
        console.error(error);
        return res.status(500).send({
            message:"Internal server error"
        })
     }
};
//controller to check if a movie or series bookmarked by a user or not
exports.checkbookmark = async(req,res)=>{
      const user = await UserModel.findById(req.userId);

      return res.status(200).send({
        success:true,
        message:"bookmark not exists",
        bookmarkmovie:user.bookmarkmovies,
        bookmarkseries:user.bookmarkseries
      })
}

//controller to add a movie or series to user's bookmark
exports.setbookmarkController = async(req,res)=>{
    const {movieId,tvId} = req.body;
     try{
        
        const user = await UserModel.findById(req.userId);

        if(!user){
            return res.status(404).send({message:"User Not Found"});
        }
        
        if(movieId && user.bookmarkmovies.includes(movieId)){
            return res.status(400).send({message:"movie already exists in bookmark"});
        }

        if(tvId && user.bookmarkseries.includes(tvId)){
            return res.status(400).send({message:"series is already exists in bookmark"});
        }

        if(movieId){
            user.bookmarkmovies.push(movieId)
        }

        if(tvId){
            user.bookmarkseries.push(tvId);
        }
         await user.save();
        res.status(200).send({
            success:true,
            message:"movies or series added successfully..",
            movies:user.bookmarkmovies,
            series:user.bookmarkseries
        })

     }
     catch(error){
        console.error(error);
        return res.status(500).send({message:"Internal server error"});
     }
};

//controller to remove bookmark
exports.removebookmarkcontroller = async(req,res)=>{
    const {id} = req.params;
      try{
          const user = await UserModel.findById(req.userId);
          if(!user){
            return res.status(404).send({message:"User not found"});
          }
          //check if bookmark exists or not
          let removebookmark = null;
          if(user.bookmarkmovies.includes(id)){
              removebookmark = id;
              user.bookmarkmovies.pull(id);
          }
          if(user.bookmarkseries.includes(id)){
            removebookmark = id;
            user.bookmarkseries.pull(id);
          }

          if(!removebookmark){
            return res.status(404).send({message:"bookmark does not exist"});
          }

          await user.save();

          res.status(200).send({
            success:true,
            message:"bookmark deleted successfully",
            removebookmark
          })
      }
      catch(error){
        console.error(error);
        return res.status(500).send({message:"Internal server error"});
      }
}






