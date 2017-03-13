const path = require('path');
const http =require('http');
const express = require('express');
const socketIO= require('socket.io');
const {Users} = require('./user');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

var publicPath=path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));
 

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
{
    io.emit('newMsg',msg);
    callback()
});

socket.on('shareLocation',(obj)=>
{
	var a= generateLocationMsg("user",obj.lat,obj.lon);
	console.log(a);

	io.emit('newLocationMsg',generateLocationMsg("user",obj.lat,obj.lon));
})});



server.listen(port);