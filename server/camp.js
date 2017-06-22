const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


const campSchema = new mongoose.Schema({
	email:
	{
		type:String,
		unique:true,
		required:true
	},
	name:{
		type:String,
		required:'please provide name',
		trim:true
	},
});

module.exports = mongoose.model('Camp', campSchema)