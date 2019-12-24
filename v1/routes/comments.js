//express router
const express = require("express");
//must add {mergeParam:true} to let comment routes have access to req.params.id
const router = express.Router({mergeParams:true})


const Comment = require("../models/comments")
const Campground = require("../models/campground")
//comments new
router.get("/new",isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id)
		.then((campground)=>{
			res.render("comments/new",{campground})
	})
	.catch((err)=>{
		console.log(err)
	})
})
//comments create
router.post("/",isLoggedIn,(req,res)=>{
	const comment = req.body.comment
	Comment.create(comment)
		.then((comment)=>{
		// console.log(comment)
		Campground.findById(req.params.id)
			.then((campground)=>{
			//add username and id to comment到这一步的时候user肯定已经login，所以可以用req.user 
			comment.auther.id = req.user._id;
			comment.auther.username = req.user.username;
			comment.save();
			campground.comments.push(comment);
			campground.save()
				.then(()=>{res.redirect(`\/campgrounds\/${campground._id}`)
				})	
			})
		})
			.catch((err)=>{
				console.log(err)
				res.redirect("/campgrounds")
			})
})
//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login")
}
module.exports = router;