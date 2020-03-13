

let socket = io('/user');

socket.on('updateWindmill', function(meterPerSecond){
	updateWindmillSpeed(meterPerSecond);
});

// temp chat shit
$(function () {
  $('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
});
