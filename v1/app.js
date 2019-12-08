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

const campgroundaSchema=new mongoose.Schema({
	name:String,
	image:String,
	description:String
})
const Campground = mongoose.model('Campground',campgroundaSchema)

// Campground.create({
// 	name:'Nanaimo',
// 	image: 'https://www.shopskibluemt.com/content/images/thumbs/0000569_yeti-mountain-campsite_625.jpeg',
// 	description:'it is beautiful'
// })


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
			  res.render('index', { campgrounds })
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
  res.render('new')
})
//Show route,show more info of campground
app.get('/campgrounds/:id', (req,res)=>{
	console.log(req.params.id)
	const campgroundId = req.params.id
	Campground.findById(campgroundId,(err,foundCampground)=>{
	err?console.log(err):res.render('show',{foundCampground} )
})	
})




app.listen(PORT, () => {
  // console.log('server started!')
})