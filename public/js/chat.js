var socket = io();

function scrollToBottom()
{
	var message = $("#msgstack");
	var newMessage= message.children('li:last-child');

	var clientHeight = message.prop('clientHeight');
	var scrollTop = message.prop('scrollTop');
	var scrollHeight = message.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();
	 if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
	{
		
	message.scrollTop(scrollHeight);
	  }
}



socket.on('connect',function(){

var params= $.deparam(window.location.search);
socket.emit('join',params,function(err){
	if(err){
		alert(err);
		window.location.href="/";
	}else{
		
	}
});
});

socket.on('updatedUserList',function(users){
	var ol=$('<ol></ol');
	users.forEach(function(user){
		ol.append($('<li></li>').text(user));
	});
	
	$('#users').html(ol);}
);

socket.on('disconnect',function(){
	console.log("disconnected!!!");
});

socket.on('newMsg',function(msg)
{	var formatedTime =moment(msg.createdAt).format('h:mm a')
	

	var src=$('#hbr').html();
	var template =Handlebars.compile(src);
	var data = {
		from : msg.from,
		text :msg.text,
		createdAt:formatedTime
	}
	var html=template(data);
	$('#msgstack').append(html);
	scrollToBottom();
	// var li = $('<li></li>');
	// li.text("from :" + msg.from +" : "+ formatedTime +":"+ msg.text);
	// $('#msgstack').append(li);

	
});

	var locationl=$('#sendLocation');
	locationl.on('click',function(){
		locationl.attr('disabled','disabled').text('sending...')
		navigator.geolocation.getCurrentPosition(function (position) {
			locationl.removeAttr('disabled').text('send location ');
			socket.emit('shareLocation',{
				lat : position.coords.latitude,
				lon : position.coords.longitude,
				createdAt: new Date().getTime()
			})
		}
	)});




$('#msg-form').on('submit',function(e){
	e.preventDefault();
	var msgBox=$('[name=msg]');
	socket.emit('createMsg',{
		from:"user",
		text : msgBox.val(),
		createdAt :  new Date().getTime()
	},function(){
		msgBox.val('');
		
	})
})

socket.on('newLocationMsg',function(msg){
	var formatedTime = moment(msg.createdAt).format('h:mm a');

var src=$('#hbrLoc').html();
	var template =Handlebars.compile(src);
	var data = {
		from : msg.from,
		url :msg.url,
		createdAt:formatedTime
	}
	var html=template(data);
	$('#msgstack').append(html);;
	
	scrollToBottom();

})