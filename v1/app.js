const express = require('express');
const bodyParser = require("body-parser");
const app = express()
const mongoose = require('mongoose')
const PORT = 3000
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true})
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
const Comment = require("./models/comments")
const Campground = require("./models/campground")
const seedDB = require("./seeds")

seedDB()

app.get('/', (req, res) => {
  res.render('landing')
})
//index route,show all the campgrounds
app.get('/campgrounds', (req, res) => {
	//get all campgrounds from db
	Campground.find({},(err,campgrounds)=>{
		if(err){
			console.log(err)
		}	else{
			  res.render('campgrounds/index', { campgrounds })
		}
		
	})
})
//create route,add new campground
app.post('/campgrounds', (req, res) => {
  const name = req.body.name
  const image = req.body.image
  const description = req.body.description
  const newCampground = { name, image, description }
  Campground.create(newCampground,(err,newlyCreatedCampground)=>{
	  err?console.log(err):res.redirect('/campgrounds')
  })
})
//New route,show form to submit new campground
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})
//Show route,show more info of campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {foundCampground});
        }
    });
})

//====================
// comments route
//====================
app.get("/campgrounds/:id/comments/new",(req,res)=>{
	Campground.findById(req.params.id)
		.then((campground)=>{
		// console.log(campground)
			res.render("comments/new",{campground})
	})
	.catch((err)=>{
		console.log(err)
	})
})
app.post("/campgrounds/:id/comments",(req,res)=>{
	const comment = req.body.comment
	Comment.create(comment)
		.then((comment)=>{
		console.log(comment)
		Campground.findById(req.params.id)
			.then((campground)=>{
			console.log(campground)
			campground.comments.push(comment)
			campground.save()
				.then(()=>{
					res.redirect(`\/campgrounds\/${campground._id}`)
				})	
			})
		})
			.catch((err)=>{
				console.log(err)
				res.redirect("/campgrounds")
			})
})


app.listen(PORT, () => {
  console.log('server started!')
})