const Campground = require("../models/campground");
const Comment = require("../models/comments");

const middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id)
			.then((campground)=>{
				if(campground.auther.id.equals(req.user._id)){
					next()
				} else{
					req.flash("error","You do not have permission to do that")
					res.redirect("back")
				}
			})
			.catch((err)=>{
				req.flash("error","Campground not found")
				res.redirect("back")
			})
	} else{
		req.flash("error","You must be logged in to do that")
		res.redirect("back")
	}
};
middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id)
			.then((foundComment)=>{
				if(foundComment.auther.id.equals(req.user._id)){
					next()
				} else{
					res.redirect("back")
				}
			})
			.catch(()=>{
				res.redirect("back")
			})
	} else{
		req.flash("error","You don't have permission to do that")
		res.redirect("back")
	}
};
middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next()
	};
	req.flash("error","You must log in to do that")
	res.redirect("/login")
}





module.exports = middlewareObj;