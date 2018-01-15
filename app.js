// Set up 
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Trail      = require("./models/trail"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

// Require routes
var commentRoutes    = require("./routes/comments"),
    trailRoutes = require("./routes/trails"),
    indexRoutes      = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost/trail-blazer";
// connect mongoose
mongoose.connect(url);

app.locals.moment = require("moment");
app.use(bodyParser.urlencoded({extended: true})); // Tell Express to use body-parser
app.set("view engine", "ejs"); // Don't need to use .ejs 
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the db

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Karn is the greatest ever",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// passes req.user and req.flash() to every template (will be called on every route)
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Use 3 route files
app.use("/", indexRoutes);
// appends /trails to start of routes in trailRoutes
app.use("/trails", trailRoutes);
// same as above except longer string
app.use("/trails/:id/comments", commentRoutes);

// Start Express server
var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function(){
  console.log("The TrailBlazer server has started.")
});