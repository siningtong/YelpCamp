const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	text:String,
	auther:String
})

module.exports = mongoose.model("Comment",commentSchema)