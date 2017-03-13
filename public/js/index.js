var socket = io();

socket.on('connect',function(){
	console.log('connected to server');
});


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
		// var src=$('#hbr').html()
		// var template= Handlebars.compile(src);
		// var context = {name:"mahe"}
		// var html = template(context);
		// $('#msg-form').html(html);
	})
})

socket.on('newLocationMsg',function(msg){
	var formatedTime = moment(msg.createdAt).format('h:mm a');
	// var li =$('<li></li>');
	// var a = $('<a target="_blank">My current location</a>');
	// li.text(msg.from +' :' + formatedTime);
	// a.attr('href',msg.url);
	// li.append(a);
	// $('#msgstack').append(li);


var src=$('#hbrLoc').html();
	var template =Handlebars.compile(src);
	var data = {
		from : msg.from,
		url :msg.url,
		createdAt:formatedTime
	}
	var html=template(data);
	$('#msgstack').append(html);;
	

























})