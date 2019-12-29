const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	text:String,
	createdAt:{type:Date,default:Date.now},
	auther:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	}
})

module.exports = mongoose.model("Comment",commentSchema)