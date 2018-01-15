var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

// ROOT ROUTE
router.get("/", function(req, res){
  res.render("landing");
});

// =============
// AUTHENTICATION ROUTES
//==============

// show register form
router.get("/register", function(req, res){
  res.render("register", {page: 'register'});
});

// handle sign up logic
router.post("/register", function(req, res){
  // create new user
  var newUser = new User({username: req.body.username});
  // logic to create new user with hashed password
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      return res.render("register", {error: err.message});
    }
    // log user in once they have signed up (authenticate them)
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Successfully signed up!");
      res.redirect("/trails");
    });
  });
});

// show login form
router.get("/login", function(req, res){
  res.render("login", {page: 'login'});
})

// handling login logic
router.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/trails", 
    failureRedirect: "/login"
  }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/trails");
});

module.exports = router;