var express =       require("express"),
    app =           express(),
    bodyParser =    require("body-parser"),
    mongoose =      require("mongoose"),
    Campground =    require("./models/campground"),
    Comment =       require("./models/comment"),
    seedDB =        require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v4");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));

app.get("/", function(req,res){
    res.render("landing");

})
app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log("Error aa gya be");
        }
        else{
            console.log(allCampgrounds);
            res.render("campgrounds/index",{allCampgrounds,allCampgrounds});
        }
    }) 
})

app.post("/campgrounds",function(req,res){
    var name=req.body.name;
    var image= req.body.image;
    var desc= req.body.description;
    var newCampground = {name:name,image:image,description:desc};
    // campgrounds.push(newCampground)

    Campground.create(newCampground,function(err,campground){
        if(err){
        console.log("Unexpected Error!!");
        }
        else{
            // console.log("Newly Created Campground:  ");
            // console.log(campground);
            res.redirect("/campgrounds");
        }
    })

    
})

app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new.ejs");
})
 
app.get("/campgrounds/:id", function(req,res){

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
// ==============================
// Comments Routes
// ==============================

app.get("/campgrounds/:id/comments/new", function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new",{campground:campground})
        }
    })
})

app.post("/campgrounds/:id/comments", function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        } else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                } else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    })
})

app.listen(3000,function(){
    console.log("YelpCamp has started")
})