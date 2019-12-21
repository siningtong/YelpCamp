const express = require('express');
const bodyParser = require("body-parser");
const app = express()
const mongoose = require('mongoose')
const passport = require("passport");
const User = require("./models/user")
const LocalStrategy = require("passport-local")
const PORT = 3000
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true})
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))
const Comment = require("./models/comments")
const Campground = require("./models/campground")
const seedDB = require("./seeds")
//passport configuration
app.use(require("express-session")({
	secret:"Calvin is the most handsome guy in Nanaimo",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(function(User, done) {
  done(null, User);
});
passport.deserializeUser(function(User, done) {
  done(null, User);
});
//自己写的middleware，每个route都会执行，并且把req.user传递给每个template
app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	next()
})

seedDB()

app.get('/', (req, res) => {
  res.render('landing')
})
//index route,show all the campgrounds
app.get('/campgrounds', (req, res) => {
	const currentUser = req.user
	console.log(currentUser)
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
            //render show template with that campground
            res.render("campgrounds/show", {foundCampground});
        }
    });
})

//====================
// comments route
//====================
app.get("/campgrounds/:id/comments/new",isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id)
		.then((campground)=>{
			res.render("comments/new",{campground})
	})
	.catch((err)=>{
		console.log(err)
	})
})
app.post("/campgrounds/:id/comments",isLoggedIn,(req,res)=>{
	const comment = req.body.comment
	Comment.create(comment)
		.then((comment)=>{
		// console.log(comment)
		Campground.findById(req.params.id)
			.then((campground)=>{
			// console.log(campground)
			campground.comments.push(comment)
			campground.save()
				.then(()=>{			res.redirect(`\/campgrounds\/${campground._id}`)
				})	
			})
		})
			.catch((err)=>{
				console.log(err)
				res.redirect("/campgrounds")
			})
})
//=====================
//Auth routes
//=====================
app.get("/register",(req,res)=>{
	res.render("register")
});
//handling user sign up
app.post("/register",(req,res)=>{
	const newUser = new User({username:req.body.username})
	User.register(newUser, req.body.password, (err,user)=>{
		if(err){
			console.log(err)
			return res.redirect("/register")
		}
		passport.authenticate("local")(req,res,()=>{
			res.redirect("/campgrounds")
		})
	})
})
//login routes
app.get("/login",(req,res)=>{
	res.render("login")
});
app.post("/login", passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),(req,res)=>{})
//logout route
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/campgrounds');
});

//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login")
}


app.listen(PORT, () => {
  console.log('server started!')
})