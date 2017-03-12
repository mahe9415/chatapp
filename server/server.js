const path = require('path');
const http =require('http');
const express = require('express');
const socketIO= require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);


var publicPath=path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));
 

var generateMsg =(from,text)=>
{
	return {from,text};
}
var generateLocationMsg = (from,lat,lon)=>{
	return {
		from,
		url : "https://www.google.com/maps?q="+lat+','+lon,
		createdAt : new Date().getTime()
	};
}


io.on('connection',function(socket){
	console.log('connected to sever');

socket.on('disconnect',function()
{
	console.log('user disconnected');
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
})

















});




server.listen(port);