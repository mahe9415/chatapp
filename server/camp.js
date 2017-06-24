const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connect('mongodb://mahe:123@ds135592.mlab.com:35592/shoutout'));


const campSchema = new mongoose.Schema({
	admin_email:
	{
		type:String,
		required:true
	},
	admin_name:
	{
		type:String,
		required:true
	},
	camp_name:
	{
		type:String,
		required:'please provide name',
		trim:true
	},
	description:{
		type:String,
		trim:true
	},
	date:{
		type:Date
	},
	camp_id:
	{
		type:String,
		required:true,
		unique:true
	},
	count:
	{
		type:Number,
		default:0
	},
	photo:{
		type:String
	}
});
campSchema.plugin(autoIncrement.plugin, {
    model: 'Camp',
    field: 'camp_id',
    startAt: 1,
    incrementBy:1
});


module.exports = mongoose.model('Camp', campSchema)