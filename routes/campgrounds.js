var express= require("express");
var router = express.Router();
var Campground = require("../models/campground")

router.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log("Error aa gya be");
        }
        else{
            console.log(allCampgrounds);
            res.render("campgrounds/index",{allCampgrounds:allCampgrounds, currentUser: req.user});
        }
    }) 
})

router.post("/campgrounds",isLoggedIn,function(req,res){
    var name=req.body.name;
    var image= req.body.image;
    var desc= req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name,image:image,description:desc,author:author};
    // campgrounds.push(newCampground)

    Campground.create(newCampground,function(err,campground){
        if(err){
        console.log("Unexpected Error!!");
        }
        else{
             console.log("Newly Created Campground:  ");
             console.log(campground);
            res.redirect("/campgrounds");
        }
    })

    
})

router.get("/campgrounds/new", isLoggedIn, function(req,res){
    res.render("campgrounds/new.ejs");
})
 
router.get("/campgrounds/:id", function(req,res){

    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            // console.log("--------------------2----------------------")
            console.log(err);
        }else{
            // console.log("------------------3------------------------")
            res.render("campgrounds/show",{campground: foundCampground});
        }
    })
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}
module.exports = router;