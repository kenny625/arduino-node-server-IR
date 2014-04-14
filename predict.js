var serial = require("serialport");
var SerialPort = serial.SerialPort;
var io = require('socket.io').listen(8001);
io.set('log level', 1);
var fs = require('fs');
var filepath = '\/Volumes\/RamDisk\/';
var trainInputPath;
var testDataPath = '\/Volumes\/RamDisk\/testData';
var testDataScalePath = '\/Volumes\/RamDisk\/testDataScale';
var modelPath;
var scaleInputPath = '\/Volumes\/RamDisk\/scaleInput';
var outputPath = '\/Volumes\/RamDisk\/output.out';
var sys = require('sys');
var exec = require('child_process').exec;
var child;
var start = false;

io.sockets.on('connection', function (socket) {
    //    setInterval(function(){}, 2000);
    sp1.on("data", function (data) {
        //            console.log( data );
        socket.emit('sensorValue', data);

    });
    
    socket.on('filename', function (data) {
      if(data != ""){
        trainInputPath = filepath + data.filename;
          console.log(trainInputPath);
          writeToFile("", trainInputPath);
      }else{
        console.log("no filename");
      }
    console.log(data);
  });
    
    socket.on('modelname', function (data) {
        if (data != "") {
            modelPath = filepath + data.modelname;
            start = true;
        } else {
            console.log("no modelname");
        }
        console.log(data);
    });
    
    socket.on('record', function (data) {
      appendToFile(data.record + "\n", trainInputPath);
      console.log(data);
  });
    var count = 0;
    socket.on('predictData', function (data) {
        if (start == true) {
            count++;
            if(count == 1){
                var lines = fs.readFileSync(trainInputPath);
                writeToFile(lines, scaleInputPath);
            }
            appendToFile(data.predictData + '\n', scaleInputPath);
            child = exec('/Volumes/RamDisk/libsvm-3.17/svm-scale -l 0 -u 1 ' + scaleInputPath, function (error, stdout, stderr) {
                var out = stdout.split('\n');
                writeToFile(out[out.length - 2], testDataScalePath);
                exec('/Volumes/RamDisk/libsvm-3.17/svm-predict ' + testDataScalePath + ' ' + modelPath + ' ' + outputPath, function (error, stdout, stderr) {
                console.log(fs.readFileSync(outputPath).toString().split('\n')[0]);
                socket.emit('result', { result: fs.readFileSync(outputPath).toString().split('\n')[0] });
                //                            sys.print('stdout: ' + stdout);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
            
            

        }
    });

});

// Replace with the device name in your machine.
var portName1 = "/dev/tty.usbmodem1411";

var sp1 = new SerialPort(portName1, {
    baudrate: 9600,
    parser: serial.parsers.readline("\n")
});

function writeToFile(data, filepath) {
//    fs.writeFileSync("/Volumes/RamDisk/libsvm-3.17/IRarray", data);
    fs.writeFileSync(filepath, data);
}

function appendToFile(data, filepath) {
    fs.appendFileSync(filepath, data);
}