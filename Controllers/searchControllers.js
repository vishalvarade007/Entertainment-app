const movieModel = require("../Models/MoviesModel");
const tvseriesModel = require("../Models/TvseriesModel");
const userModel = require("../Models/UserModel");

//controller for searching movies
exports.moviesearch = async(req,res)=>{
     try{
        const {query} = req.params;
        let movies;
        if(query){
           movies =  await movieModel.find({title:{$regex:new RegExp(query,'i')}});
        }else{
            res.send({success:true,message:"no movie found"})
        }
        res.status(200).send({
            success:true,
            movoiedata : movies
        })
     }
     catch(error){
        console.error(error);
        return res.status(500).send({success:false,message:"Internal server error"});
     }
}

//controller for searching tv series
exports.seriessearch = async(req,res)=>{
    try{
        const {query} = req.params;
        let series;
        if(query){
          series = await tvseriesModel.find({title:{$regex:new RegExp(query,'i')}});
        }
        else{
            res.send({success:true,message:"no series found"});
        }
        res.status(200).send({
            success:true,
            seriesdata:series
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).send({success:false,message:"Internal server error"});
    }
}

//controller for searching both movies and series toghether
exports.multisearch = async(req,res)=>{
    try{
        const {query} = req.params;

        //search movies
        const movies = await movieModel.find({title:{$regex:new RegExp(query,'i')}});
        //search series
        const series = await tvseriesModel.find({title:{$regex:new RegExp(query,'i')}});

        const searchData = [...movies,...series];

        if(searchData.length === 0){
            return res.status(404).send({
                success:true,
                message:"No results found"
            })
        }
        return res.status(200).send({
            success:true,
            searchData
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).send({success:false,message:"Internal server error"});
    }
};

//controller for searching bookmarked movies and series
exports.bookmarksearch=async(req,res)=>{
    try{
        const {query} = req.params;

        const user = await userModel.findById(req.userId)
        .populate('bookmarkmovies')
        .populate('bookmarkseries')

        if(!user){
            return res.status(404).send({message:"User not found"});
        }

        const searchData = [...(user.bookmarkmovies || []),...(user.bookmarkseries || [])];

        const filteredData = searchData.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));

        if(filteredData.length === 0){
            return res.status(404).send({success:true,message:"No results found"});
        }

        return res.status(200).send({
            success:true,
            searchdata:filteredData
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).send({success:false,message:"Internal server error"});
    }
}