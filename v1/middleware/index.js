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
					res.redirect("back")
				}
			})
			.catch((err)=>{
				console.log(err);
				res.redirect("back")
			})
	} else{
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
		res.redirect("back")
	}
};
middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login")
}





module.exports = middlewareObj;