var express = require("express");
var router  = express.Router();
var Trail = require("../models/trail");
var middleware = require("../middleware");
var geocoder = require("geocoder");

// INDEX - displays all trails
router.get("/", function(req, res){
  // Get all trails from db
  Trail.find({}, function(err, allTrails){
    if(err){
      console.log(err);
    } else {
      res.render("trails/index", {trails: allTrails, page: 'trails'});
    }
  });
});

//CREATE - add new trail to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to trails array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || data.status === 'ZERO_RESULTS') {
      req.flash('error', 'Invalid address');
        return res.redirect('back');
    }
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newTrail = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new trail and save to DB
    Trail.create(newTrail, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to trails page
            res.redirect("/trails");
        }
    });
  });
});

// NEW - displays form to create new trail
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("trails/new");
});

// SHOW - shows more info about one trail
router.get("/:id", function(req, res){
  // find the trail with provided ID and populate comments
  Trail.findById(req.params.id).populate("comments").exec(function(err, foundTrail){
    if(err){
      console.log(err);
    } else {
      // render show template with that trail
      res.render("trails/show", {trail: foundTrail});
    }
  });
});

// EDIT trail routes (form)
router.get("/:id/edit", middleware.checkTrailOwnership, function(req, res){
  Trail.findById(req.params.id, function(err, foundTrail){
    res.render("trails/edit", {trail: foundTrail});
    });
});

// UPDATE trail route (where form submits)
router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || data.status === 'ZERO_RESULTS') {
      req.flash('error', 'Invalid address');
        return res.redirect('back');
    }
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, location: location, lat: lat, lng: lng};
    Trail.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, trail){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/trails/" + trail._id);
        }
    });
  });
});

// DESTROY trail route
router.delete("/:id", middleware.checkTrailOwnership, function(req, res){
  Trail.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/trails");
    } else {
      res.redirect("/trails");
    }
  });
});

module.exports = router;