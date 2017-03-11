var socket = io();

socket.on('connect',function(){
	console.log('connected to server');
});


socket.on('disconnect',function(){
	console.log("disconnected!!!");
});

socket.on('newMsg',function(msg)
{	console.log(msg);
	var li = $('<li></li>');
	li.text("from :"+msg.from +" : "+ msg.text);
	$('#msgstack').append(li);

	
});

$('#msg-form').on('submit',function(e){
	e.preventDefault();
	socket.emit('createMsg',{
		from:"user",
		text : $('[name=msg]').val()
	})
})

