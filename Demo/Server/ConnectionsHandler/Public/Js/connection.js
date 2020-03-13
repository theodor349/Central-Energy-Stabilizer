let socket = io('/user');

socket.on('updateWindmill', function(meterPerSecond) {
  updateWindmillSpeed(meterPerSecond);
});

socket.on('addDevice', function(device) {
  addWaterHeater(device);
  console.log("Added a device");
});

socket.on('updateDevice', function(device) {

});

// temp chat shit
$(function() {
  $('form').submit(function(e) {
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
});