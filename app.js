var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

var campgrounds = [
    {name:"Aravalis", image:"https://cdn.pixabay.com/photo/2016/07/02/19/45/fjord-1493687__340.jpg"},
    {name:"Himalayas",image:"https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092__340.jpg"},
    {name:"girl",image:"https://cdn.pixabay.com/photo/2016/04/09/23/10/girl-1319115__340.jpg"}
]

app.get("/", function(req,res){
    res.render("landing");

})
app.get("/campgrounds",function(req,res){
    
    res.render("campgrounds",{campgrounds,campgrounds});
})

app.post("/campgrounds",function(req,res){
    var name=req.body.name;
    var image= req.body.image;
    var newCampground = {name:name,image:image};
    campgrounds.push(newCampground)
    res.redirect("/campgrounds");
})

app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
})

app.listen(3000,function(){
    console.log("YelpCamp has started")
})