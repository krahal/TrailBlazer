var Trail = require("../models/trail");
var Comment    = require("../models/comment");

// all the middleware goes here
var middlewareObj = {}

// check if currently logged in user owns a trail before EDIT, UPDATE, AND DESTROY
middlewareObj.checkTrailOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Trail.findById(req.params.id, function(err, foundTrail){
      if(err){
        req.flash("error", "Trail not found");
        res.redirect("back");
      } else {
        // does user own trail
        if(foundTrail.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
}

// check if currently logged in user owns a comment before EDIT, UPDATE, AND DESTROY
middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        res.redirect("back");
      } else {
        // does user own comment?
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
}

// check if user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  // flash message before redirect
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
} 

module.exports = middlewareObj;