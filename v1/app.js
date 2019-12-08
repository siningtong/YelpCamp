const express = require('express');
const bodyParser = require("body-parser");
const app = express()
const mongoose = require('mongoose')
const PORT = 3000
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true})
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const campgroundaSchema=new mongoose.Schema({
	name:String,
	image:String
})
const Campground = mongoose.model('Campground',campgroundaSchema)

// Campground.create( {
//     name: 'Mountain Goat',
//     image: 'https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525'
//   }, (err,campground)=>{
// 	if(err){
// 		console.log(err)
// 	} else{
// 		console.log('Newly created campground')
// 		console.log(campground)
// 	}
// })


// let campgrounds = [
//   {
//     name: 'Salmon Creek',
//     image: 'https://www.shopskibluemt.com/content/images/thumbs/0000569_yeti-mountain-campsite_625.jpeg'
//   },
//   {
//     name: 'Granite Hill',
//     image: 'https://koa.com/blog/images/make-campsite-feel-like-home.jpg?preset=blogPhoto'
//   }, {
//     name: 'Mountain Goat',
//     image: 'https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525'
//   },
//   {
//     name: 'Mountain Goat',
//     image: 'https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525'
//   },
//   {
//     name: 'Mountain Goat',
//     image: 'https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525'
//   },
//   {
//     name: 'Mountain Goat',
//     image: 'https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525'
//   },
//   {
//     name: 'Mountain Goat',
//     image: 'https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525'
//   },
//   {
//     name: 'Mountain Goat',
//     image: 'https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525'
//   }
// ]



app.get('/', (req, res) => {
  res.render('landing')
})

app.get('/campgrounds', (req, res) => {
	//get all campgrounds from db
	Campground.find({},(err,campgrounds)=>{
		if(err){
			console.log(err)
		}	else{
			  res.render('campgrounds', { campgrounds })
		}
		
	})
})

app.post('/campgrounds', (req, res) => {
  const name = req.body.name
  const image = req.body.image
  const newCampground = { name, image }
  Campground.create(newCampground,(err,newlyCreatedCampground)=>{
	  err?console.log(err):res.redirect('/campgrounds')
  })
})

app.get('/campgrounds/new', (req, res) => {
  res.render('new')
})




app.listen(PORT, () => {
  // console.log('server started!')
})