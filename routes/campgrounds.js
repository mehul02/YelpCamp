var express= require("express");
var router = express.Router();
var Campground = require("../models/campground")
var middleware = require("../middleware")

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

router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
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

router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res){
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

router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership, function(req,res){

    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit", {campground:foundCampground});
    })

})

router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds")
        }
    })
})

module.exports = router;