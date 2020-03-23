var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment =   require("./models/comment")
var data = [
    {
        name: "Night's Watch",
        image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg",
        description: "blah blah blah"
    },
    {
        name: "Dragon's Place",
        image: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142__340.jpg",
        description: "blah blah blah jshd  jshfojh"
    },
    {
        name: "Desert Mesa",
        image: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg",
        description: "blah asfgk uksf kg khsgfk  kasfgh  blah blah"
    },
    {
        name: "How about this",
        image: "https://cdn.pixabay.com/photo/2016/03/30/02/57/camping-1289930__340.jpg",
        description: "blah blah  asfg kagsf kahgsf ksag fkoplasufpi afs hlkgaf blah"
    }
]

function seedDB(){
    Campground.remove({},function(err){
        if(err){
            console.log(err);
        }
        console.log("removed Campgrounds!")
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if(err){
                    console.log(err);
                } else{
                    console.log("added a campground")
                    Comment.create(
                        {
                            text: "This palce is Great but I wish there was Internet",
                            author: "Mehul Bhutalia"
                        }, function(err,comment){
                            if(err){
                                console.log(err);
                            } else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created new comment")
                            }
                        })
                }
            });
        })
    })
    
}
module.exports= seedDB;