var mongoose = require("mongoose");

var trailSchema = new mongoose.Schema({
  name: String,
  image: String,
  location: String,
  lat: Number,
  lng: Number,
  createdAt: {type: Date, default: Date.now},
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  // associate comments with trail
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// compile schema into model
module.exports = mongoose.model("Trail", trailSchema);
