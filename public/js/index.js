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
		locationl.attr('disabled','disabled').text('sending...')
		navigator.geolocation.getCurrentPosition(function (position) {
			locationl.removeAttr('disabled').text('send location');
			socket.emit('shareLocation',{
				lat : position.coords.latitude,
				lon : position.coords.longitude
			})
		}
	)});




$('#msg-form').on('submit',function(e){
	e.preventDefault();
	var msgBox=$('[name=msg]');
	socket.emit('createMsg',{
		from:"user",
		text : msgBox.val()
	},function(){
		msgBox.val(' ');
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