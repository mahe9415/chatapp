const path = require('path');
const http =require('http');
const mongoose = require('mongoose');
const express = require('express');
const socketIO= require('socket.io');
const {Users} = require('./user');
const Camp = require('./camp.js')
const multer=require('multer')
var app = express();
var bodyParser = require('body-parser')
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

var publicPath=path.join(__dirname,'../public');
const port = process.env.PORT || 7000;
app.use(express.static(publicPath));
 // Connect to our Database and handle an bad connections
mongoose.connect('mongodb://mahe:123@ds135592.mlab.com:35592/shoutout');
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});



app.use(bodyParser.urlencoded({ extended: false }))

var generateMsg =(from,text)=>
{
	return {from,text,
		createdAt : new Date().getTime()
	};
}
var generateLocationMsg = (from,lat,lon)=>{
	return {
		from,
		url : "https://www.google.com/maps?q="+lat+','+lon,
		createdAt : new Date().getTime()
	};
}

var isString= (str)=>{
	return typeof str ==='string' && str.trim().length>0;
};

io.on('connection',function(socket){
	


	socket.on('join',(params,callback)=>
	{	
		if(!isString(params.name) || !isString(params.room)){

			callback("name and room name are required");
		} 
	socket.join(params.room);
	users.removeUser(socket.id);
	users.addUser(socket.id,params.name,params.room);
	io.to(params.room).emit('updatedUserList',users.getUserList(params.room));
	socket.emit('newMsg',generateMsg('Admin','Welcome to chat app'));
	socket.broadcast.to(params.room).emit('newMsg',generateMsg('Admin',params.name + "has joined"));
	callback()
	});

socket.on('disconnect',function()
{
	var user = users.removeUser(socket.id);
	if(user){
		io.to(user.room).emit('updatedUserList',users.getUserList(user.room));
		io.to(user.room).emit('newMsg',generateMsg('Admin',user.name +"has left"));
	}
})

socket.on('createMsg',(msg,callback)=>
{	var user= users.getUser(socket.id);

	if(user && isString(msg.text)){
	io.to(user.room).emit('newMsg',generateMsg(user.name,msg.text));	
	}
    
    callback()
});

socket.on('shareLocation',(obj)=>
{
	var a= generateLocationMsg("user",obj.lat,obj.lon);
	
	var user=users.getUser(socket.id);
	io.to(user.room).emit('newLocationMsg',generateLocationMsg(user.name,obj.lat,obj.lon));
})});

const multerOptions ={
	storage:multer.memoryStorage(),
	fileFilter(req,file,next){
		const isPhoto = file.mimetype.startsWith('image/');
		if(isPhoto){
			next(null,true);
		}
		else{
			next({message:'That filetype is not allowed'},false);
		}
	}
}
const upload = multer(multerOptions).single('photo');

app.post('/camp',(req, res)=>{
  const obj = new Camp({
  })
  obj.save()
	res.json(req.body)
})
app.get('/bubbly',(req,res)=>{
	const camps=Camp.find({}).then((doc)=>{
		res.json(doc);
		res.end();
	})
})

server.listen(port);