var socket = io();

socket.on('connect',function(){
	console.log('connected to server');
});

socket.on('disconnect',function(){
	console.log("disconnected!!!");
});


socket.on('send',function(obj){
	console.log(obj)
})

socket.emit('create',{
	'email':"mahe@gmail.com",
	'pass':"kick"
})
