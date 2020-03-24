var express =       require("express"),
    app =           express(),
    bodyParser =    require("body-parser"),
    mongoose =      require("mongoose"),
    passport =      require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride =require("method-override"),
    Campground =    require("./models/campground"),
    Comment =       require("./models/comment"),
    User =          require("./models/user")
    seedDB =        require("./seeds");

var commentRoutes =     require("./routes/comments"),
    campgroundRoutes =  require("./routes/campgrounds"),
    indexRoutes =        require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp_v4");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
// seedDB();

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

app.use(indexRoutes);
app.use(commentRoutes);  
app.use(campgroundRoutes);  // app.use("/campgrounds", campgroundRoutes) so all routes in campgrounds is appended with /campgrounds automatically cleaning video 244

app.listen(3000,function(){
    console.log("YelpCamp has started")
})