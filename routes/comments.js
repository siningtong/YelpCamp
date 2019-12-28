//express router
const express = require("express");
const middleware = require("../middleware")
//must add {mergeParam:true} to let comment routes have access to req.params.id
const router = express.Router({mergeParams:true})


const Comment = require("../models/comments")
const Campground = require("../models/campground")
//comments new
router.get("/new",middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id)
		.then((campground)=>{
			res.render("comments/new",{campground})
	})
	.catch((err)=>{
		console.log(err)
	})
})
//comments create
router.post("/",middleware.isLoggedIn,(req,res)=>{
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
				.then(()=>{
					req.flash("success","Successfully added comment")
					res.redirect(`\/campgrounds\/${campground._id}`)
				})	
			})
		})
			.catch((err)=>{
				req.flash("error","Something went wrong")
				res.redirect("/campgrounds")
			})
})
//edit comment
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
	const campgroundId = req.params.id
	Comment.findById(req.params.comment_id)
		.then((foundComment)=>{
			res.render("comments/edit",{foundComment,campgroundId})
		})
		.catch((err)=>{
			res.redirect("back")
})	
})
//update route
router.put("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment)
		.then((foundComment)=>{
			res.redirect(`\/campgrounds\/${req.params.id}`)
		})
		.catch((err)=>{
			console.log(err)
			res.redirect("back")
	})
})
//delete route
router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id)
		.then((detetedComment)=>{
			req.flash("success","Comment deleted")
			res.redirect(`\/campgrounds\/${req.params.id}`)
		})
		.catch((err)=>{
			res.redirect("back")
	})
})


module.exports = router;