//express router
const express = require("express");
const router = express.Router();
const middleware = require("../middleware")
const NodeGeocoder = require('node-geocoder');
 //geocoder
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
const geocoder = NodeGeocoder(options);

const Comment = require("../models/comments")
const Campground = require("../models/campground")
//index route,show all the campgrounds
router.get('/', (req, res) => {
	const currentUser = req.user;
	let noMatch = "";
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');	
		Campground.find({name: regex}, (err,campgrounds)=>{
			if(err){
				console.log(err)
			} else{
				if(campgrounds.length<1){
					noMatch = "No campgrounds match that query,please try again."
				}
			  	res.render('campgrounds/index', { campgrounds,currentUser,noMatch })
		}	
	})
	} else{
		//get all campgrounds from db
		Campground.find({},(err,campgrounds)=>{
			if(err){
				console.log(err)
			} else{
			  	res.render('campgrounds/index', { campgrounds,currentUser,noMatch })
		}
	})
	}

})
//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const price = req.body.price;
  const auther = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
		console.log(err)
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
	  console.log(data)
    const lat = data[0].latitude;
    const lng = data[0].longitude;
    const location = data[0].formattedAddress;
    const newCampground = {name, image, price, description, auther, location, lat, lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            // console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});
//New route,show form to submit new campground
router.get('/new',middleware.isLoggedIn, (req, res) => {
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
router.get("/:id/edit", middleware.checkCampgroundOwnership,(req,res)=>{	
		Campground.findById(req.params.id)
			.then((campground)=>{
				res.render("campgrounds/edit",{campground});
			})
})
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
	  console.log(data)
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
	
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});
//delete route
router.delete("/:id", middleware.checkCampgroundOwnership, (req,res)=>{
	Campground.findByIdAndRemove(req.params.id)
		.then((deletedCampground)=>{
			console.log(deletedCampground)
			res.redirect("/campgrounds")
		})
		.catch((err)=>{
		console.log(err)
		})
})
//from stack flow
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;