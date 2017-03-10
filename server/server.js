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
  

io.on('connection',(socket)=>{
	console.log('connected to sever');

	socket.on('disconnect',function(){
		console.log('user disconnected');
	})
	
	socket.on('createMsg',(m)=>{
		console.log(m)
	})
	socket.emit('newMsg',
	{
		from:"mahe",
		text:"hello"
	})

})


server.listen(port);