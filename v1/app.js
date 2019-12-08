const express = require('express');
const bodyParser = require("body-parser");
const app = express()
const PORT = 3000
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


let campgrounds = [
  {
    name: 'Salmon Creek',
    image: 'https://www.shopskibluemt.com/content/images/thumbs/0000569_yeti-mountain-campsite_625.jpeg'
  },
  {
    name: 'Granite Hill',
    image: 'https://koa.com/blog/images/make-campsite-feel-like-home.jpg?preset=blogPhoto'
  }, {
    name: 'Mountain Goat',
    image: 'https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525'
  },
  {
    name: 'Mountain Goat',
    image: 'https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525'
  },
  {
    name: 'Mountain Goat',
    image: 'https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525'
  },
  {
    name: 'Mountain Goat',
    image: 'https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525'
  },
  {
    name: 'Mountain Goat',
    image: 'https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525'
  },
  {
    name: 'Mountain Goat',
    image: 'https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525'
  }
]



app.get('/', (req, res) => {
  res.render('landing')
})

app.get('/campgrounds', (req, res) => {

  res.render('campgrounds', { campgrounds })
})

app.post('/campgrounds', (req, res) => {
  const name = req.body.name
  const image = req.body.image
  const newCampground = { name, image }
  campgrounds.push(newCampground)
  res.redirect('/campgrounds')
})

app.get('/campgrounds/new', (req, res) => {
  res.render('new')
})




app.listen(PORT, () => {
  console.log('server started!')
})