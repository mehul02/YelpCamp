var express =       require("express"),
    app =           express(),
    bodyParser =    require("body-parser"),
    mongoose =      require("mongoose"),
    passport =      require("passport"),
    LocalStrategy = require("passport-local"),
    Campground =    require("./models/campground"),
    Comment =       require("./models/comment"),
    User =          require("./models/user")
    seedDB =        require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp_v4");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
seedDB();

app.use(require("express-session")({
    secret: "Once again rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass user data in all ejs directly rather than creating objs
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})
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
            res.render("campgrounds/index",{allCampgrounds:allCampgrounds, currentUser: req.user});
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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new",{campground:campground})
        }
    })
})

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
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

// AUTH ROUTE

app.get("/register", function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        })
    })
    User.register()
})

app.get("/login", function(req,res){
    res.render("login");
})
app.post("/login",passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req,res){
})
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds")
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

app.listen(3000,function(){
    console.log("YelpCamp has started")
})