var socket = io();
socket.on('disconnect',function(){
	console.log("disconnected!!!");
})