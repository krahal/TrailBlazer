var mongoose = require("mongoose");
var Trail = require("./models/trail");
var Comment = require("./models/comment");

// Trail seed data
var data = [
  {
    name: "Cloud's Rest", 
    image: "https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?auto=format&fit=crop&w=1050&q=80",
    description: "Lorem ipsum dolor sit amet, odio ultrices metus augue. Maecenas nam blandit malesuada aliquam diam, velit quam aenean odio odio, at urna arcu pellentesque lobortis, blandit donec sem. Praesent eget nec erat erat ante, at eros posuere erat. Tincidunt vulputate magna, tellus arcu sed eros. Magna vestibulum leo nunc, magna bibendum hendrerit, facilisi et."
  },
  {
    name: "Golden Ears Provincial Park", 
    image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?auto=format&fit=crop&w=1050&q=80",
    description: "Lorem ipsum dolor sit amet, odio ultrices metus augue. Maecenas nam blandit malesuada aliquam diam, velit quam aenean odio odio, at urna arcu pellentesque lobortis, blandit donec sem. Praesent eget nec erat erat ante, at eros posuere erat. Tincidunt vulputate magna, tellus arcu sed eros. Magna vestibulum leo nunc, magna bibendum hendrerit, facilisi et."
  },
  {
    name: "Dog Trail", 
    image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&w=1050&q=80",
    description: "Lorem ipsum dolor sit amet, odio ultrices metus augue. Maecenas nam blandit malesuada aliquam diam, velit quam aenean odio odio, at urna arcu pellentesque lobortis, blandit donec sem. Praesent eget nec erat erat ante, at eros posuere erat. Tincidunt vulputate magna, tellus arcu sed eros. Magna vestibulum leo nunc, magna bibendum hendrerit, facilisi et."
  }
];

function seedDB(){
  // Remove all trails db
  Trail.remove({}, function(err){
    if(err){
      console.log(err);
    }
    console.log("removed trails");
//     Add a few trails
    data.forEach(function(seed){
      Trail.create(seed, function(err, trail){
        if(err){
          console.log(err);
        } else {
          console.log("added a trail");
        }
        // Create a  comment
        Comment.create(
          {
            text: "This place is great!",
            author: "Karn"
          }, function(err, comment){
            if(err){
              console.log(error);
            } else {
              // associate comment with trail 
              trail.comments.push(comment._id);
              trail.save();
              console.log("created new comment");
            }
          }
        );
      });
    });
  });
}

module.exports = seedDB;