var socket = io();

socket.on('connect',function(){
	console.log('connected to server');

});


socket.on('disconnect',function(){
	console.log("disconnected!!!");
});

socket.emit('createMsg',{
	text : "hello this is a msg from browser"
});


socket.on('newMsg',function(msg)
{
	console.log(msg);
});

socket.on('send',function(obj){
	console.log(obj)
})



