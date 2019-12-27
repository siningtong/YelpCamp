const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require("passport");
const methodOverride = require("method-override");
const User = require("./models/user");
const LocalStrategy = require("passport-local");
const Comment = require("./models/comments");
const Campground = require("./models/campground");
const flash = require("connect-flash");
const seedDB = require("./seeds");
//require all the route files
const campgroundsRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");
const commentsRoutes = require("./routes/comments");

const app = express();
const PORT = 3000;
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true})
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//passport configuration
app.use(require("express-session")({
	secret:"Calvin is the most handsome guy in Nanaimo",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(function(User, done) {
  done(null, User);
});
passport.deserializeUser(function(User, done) {
  done(null, User);
});
//自己写的middleware，每个route都会执行，并且把req.user传递给每个template
app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})
// tell app to use these route files we required
app.use(indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes)
//seed the database
// seedDB()


app.listen(PORT, () => {
  console.log('server started!')
})