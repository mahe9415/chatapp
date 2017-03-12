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
	li.text("from :" + msg.from +" : "+ msg.text);
	$('#msgstack').append(li);

	
});

	var locationl=$('#sendLocation');
	locationl.on('click',function(){

		navigator.geolocation.getCurrentPosition(function (position) {
			socket.emit('shareLocation',{
				lat : position.coords.latitude,
				lon : position.coords.longitude
			})
		}
	)});




$('#msg-form').on('submit',function(e){
	e.preventDefault();
	
	socket.emit('createMsg',{
		from:"user",
		text : $('[name=msg]').val()
	})
})

socket.on('newLocationMsg',function(msg){

	var li =$('<li></li>');
	var a = $('<a target="_blank">My current location</a>');
	li.text(msg.from);
	a.attr('href',msg.url);
	li.append(a);
	$('#msgstack').append(li);
})