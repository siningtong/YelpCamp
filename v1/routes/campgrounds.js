//express router
const express = require("express");
const router = express.Router()

const Comment = require("../models/comments")
const Campground = require("../models/campground")
//index route,show all the campgrounds
router.get('/', (req, res) => {
	const currentUser = req.user
	// console.log(currentUser)
	//get all campgrounds from db
	Campground.find({},(err,campgrounds)=>{
		if(err){
			console.log(err)
		}	else{
			  res.render('campgrounds/index', { campgrounds,currentUser })
		}
		
	})
})
//create route,add new campground
router.post('/',isLoggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const auther = {
	  id:req.user._id,
	  username:req.user.username
  }
  const newCampground = { name, image, description, auther}
  Campground.create(newCampground,(err,newlyCreatedCampground)=>{
	  err?console.log(err):res.redirect('/campgrounds')
  })
})
//New route,show form to submit new campground
router.get('/new',isLoggedIn, (req, res) => {
  res.render('campgrounds/new')
})
//Show route,show more info of campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {foundCampground});
        }
    });
})
//edit campground route
router.get("/:id/edit",(req,res)=>{
	Campground.findById(req.params.id)
		.then((campground)=>{
			res.render("campgrounds/edit",{campground});
		})
		.catch((err)=>{
		console.log(err)
		})
})



//update campground route
router.put("/:id",(req,res)=>{
	Campground.findByIdAndUpdate(req.params.id,req.body.campground)
		.then((campground)=>{
			console.log(campground);
			res.redirect(`\/campgrounds\/${req.params.id}`)
		})
		.catch((err)=>{
		console.log(err)
		})
})
//delete route
//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login")
}
module.exports = router;