var serial = require( "serialport" );
var SerialPort = serial.SerialPort;
var io = require('socket.io').listen(8001);
io.set('log level', 1);
var fs = require('fs');
var filepath = '\/Volumes\/RamDisk\/test.txt';

io.sockets.on('connection', function (socket) {
//    setInterval(function(){}, 2000);
     sp.on( "data", function ( data ) {
//            console.log( data );
         socket.emit('sensorValue', data);
            
        } );
  
  
});
 
// Replace with the device name in your machine.
var portName = "/dev/tty.usbmodem1411";
 
var sp = new SerialPort( portName, {
    baudrate:9600,
    parser  :serial.parsers.readline( "\n" )
} );

function writeToFile(data) {
   fs.writeFile(filepath, data, function(err) {
        if(err) {
            console.error("Could not write file: %s", err);
        }
    }); 
}

