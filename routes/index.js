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
	User.register(newUser, req.body.password)
		.then((user)=>{
			req.flash("success",`Welcome to YelpCamp ${user.username}`)
			passport.authenticate("local")(req,res,()=>{
			res.redirect("/campgrounds")
		})
		})
		.catch((err)=>{
			req.flash("error",err.message)
			return res.redirect("/register")
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
router.get('/logout', (req, res)=>{
	req.logout();
	req.flash("success","Logged you out")
	res.redirect('/campgrounds');
});

module.exports = router;