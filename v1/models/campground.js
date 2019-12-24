const mongoose = require("mongoose");

const campgroundaSchema=new mongoose.Schema({
	name:String,
	image:String,
	description:String,
	auther:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		},
		username:String
	},
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
})

module.exports = mongoose.model('Campground',campgroundaSchema)