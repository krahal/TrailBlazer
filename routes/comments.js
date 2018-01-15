var express    = require("express");
var router     = express.Router({mergeParams: true}); // merge params from trail and comments
var Trail = require("../models/trail");
var Comment    = require("../models/comment");
var middleware = require("../middleware");

// COMMENTS NEW - displays form to create new comment is user is logged in
router.get("/new", middleware.isLoggedIn, function(req, res){
  // find trail by id
  Trail.findById(req.params.id, function(err, trail){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {trail: trail});
    }
  });
});

// COMMENTS CREATE - add new comment to db
router.post("/", middleware.isLoggedIn, function(req, res){
  // look up trail using ID
  Trail.findById(req.params.id, function(err, trail){
    if(err){
      console.log(err);
      res.redirect("/trails");
    } else {
      // create new comments
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          // connect new comments to trail
          trail.comments.push(comment._id);
          trail.save();
          // redirect to trail show page
          req.flash("success", "Successfully added comment");
          res.redirect("/trails/" + trail._id);
        }
      });
    }
  });
});

// EDIT comments route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    } else {
      res.render("comments/edit", {trail_id: req.params.id, comment: foundComment});
    }
  });
});

// UPDATE comments route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  // find and update the correct trail
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if (err){
      res.redirect("back");
    } else {
      // redirect to show page
      res.redirect("/trails/" + req.params.id);
    }
  });
});

// DESTROY comments route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  // findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/trails/" + req.params.id);
    }
  });
});

module.exports = router;