//express router
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user")


const Comment = require("../models/comments")
const Campground = require("../models/campground")
//root route
router.get('/', (req, res) => {
  res.render('landing')
})

//=====================
//Auth routes
//=====================
router.get("/register",(req,res)=>{
	res.render("register")
});
//handling user sign up
router.post("/register",(req,res)=>{
	const newUser = new User({username:req.body.username})
	User.register(newUser, req.body.password, (err,user)=>{
		if(err){
			console.log(err)
			return res.redirect("/register")
		}
		passport.authenticate("local")(req,res,()=>{
			res.redirect("/campgrounds")
		})
	})
})
//login routes
router.get("/login",(req,res)=>{
	res.render("login")
});
router.post("/login", passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),(req,res)=>{})
//logout route
router .get('/logout', function(req, res){
  req.logout();
  res.redirect('/campgrounds');
});

//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login")
}
module.exports = router;