const mongoose = require("mongoose");

const campgroundaSchema=new mongoose.Schema({
	name:String,
	price:String,
	image:String,
	description:String,
	location:String,
	lat:Number,
	lng:Number,
	createdAt:{type:Date,default:Date.now},
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