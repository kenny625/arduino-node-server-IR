var sys = require('sys');
var exec = require('child_process').exec;
var child;
var trainInputPath;
var trainInputFolder = '\/Volumes\/RamDisk\/2class\/';
var trainSourcePath = '\/Volumes\/RamDisk\/26key50';
var testDataPath = '\/Volumes\/RamDisk\/26key50test';
var testDataScalePath = '\/Volumes\/RamDisk\/26key50testscale';
var resultPath = '\/Volumes\/RamDisk\/result';
var scaledTestData;
//var testDataScalePath = '\/Volumes\/RamDisk\/testDataScale';
var fs = require('fs');
var SVMclass = process.argv[2];
var execSync = require("exec-sync");

//process.argv.forEach(function (val, index, array) {
//  console.log(index + ': ' + val);
//});



//var lines = fs.readFileSync(testDataScalePath).toString().split('\n');


function exeCmd(command) {
    child = exec(command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}


//console.log(lines);

//    writeToFile(lines, "\/Volumes\/RamDisk\/testReplaceLast");
//    appendToFile('1 0:488 1:483 2:492 3:500 4:486 5:467 6:480 7:442 8:449 9:379 10:420 11:227',"\/Volumes\/RamDisk\/testReplaceLast");
//    lines = fs.readFileSync('\/Volumes\/RamDisk\/testReplaceLast').toString().split('\n');
////    console.log(lines[lines.length - 1]);
//
//child = exec('/Volumes/RamDisk/libsvm-3.17/svm-scale -l 0 -u 1 ' + "\/Volumes\/RamDisk\/testReplaceLast" , function (error, stdout, stderr) {
//    var out = stdout.split('\n');
//    console.log(out[out.length - 2]);
////                console.log(lines[lines.length]);
////                socket.emit('result', { result: fs.readFileSync(outputPath).toString().split('\n')[0] });
////                                            sys.print('stdout: ' + stdout);
//                if (error !== null) {
//                    console.log('exec error: ' + error);
//                }
//            });


var func1 = function (callback) {
    //do something.
    for (var j = 1; j <= 26; j++) {
        SVMclass = j;
        trainInputPath = trainInputFolder + SVMclass;
        var lines = fs.readFileSync(trainSourcePath).toString().split('\n');
        writeToFile('', trainInputPath);
        var featureStartIndex;
        for (var i = 0; i < lines.length - 1; i++) {
            if (Number(lines[i].split(' ')[0]) > 9) {
                featureStartIndex = 2;
            } else {
                featureStartIndex = 1;
            }
            if (lines[i].split(' ')[0] == SVMclass) {
                lines[i] = '1' + lines[i].substr(featureStartIndex) + '\n';
            } else {
                lines[i] = '0' + lines[i].substr(featureStartIndex) + '\n';
            }
            appendToFile(lines[i], trainInputPath);
        }
        scaleAndTrain(SVMclass);
        //    execSync('/Volumes/RamDisk/libsvm-3.17/svm-scale -l 0 -u 1 ' + trainInputPath + ' > ' +  trainInputFolder + SVMclass + 'scale');
        //    console.log('/Volumes/RamDisk/libsvm-3.17/svm-scale -l 0 -u 1 ' + trainInputPath + ' > ' +  trainInputFolder + SVMclass + 'scale');
        //    execSync('/Volumes/RamDisk/libsvm-3.17/svm-train -b 1 ' + trainInputFolder + SVMclass + 'scale ' + trainInputFolder + SVMclass + '.model');
        //    exeCmd('/Volumes/RamDisk/libsvm-3.17/svm-scale -l 0 -u 1 ' + trainInputPath + ' > ' +  trainInputFolder + SVMclass + 'scale');
        //    exeCmd('/Volumes/RamDisk/libsvm-3.17/svm-train -b 1 ' + trainInputFolder + SVMclass + 'scale ' + trainInputFolder + SVMclass + '.model');
        //    console.log('/Volumes/RamDisk/libsvm-3.17/svm-train -b 1 ' + trainInputFolder + SVMclass + 'scale ' + trainInputFolder + SVMclass + '.model');

        //    child = exec('/Volumes/RamDisk/libsvm-3.17/svm-train -b 1 ' + trainInputFolder + SVMclass + 'scale ' + trainInputFolder + SVMclass + '.model', function (error, stdout, stderr) {
        //        if (error !== null) {
        //            console.log('exec error: ' + error);
        //        }
        //    });
    }
    (callback && typeof (callback) === "function") && callback();
}

    function scaleAndTrain(SVMclass) {
        child = exec('/Volumes/RamDisk/libsvm-3.17/svm-scale -l 0 -u 1 ' + trainInputPath + ' > ' + trainInputFolder + SVMclass + 'scale', function (error, stdout, stderr) {
            exec('/Volumes/RamDisk/libsvm-3.17/svm-train -b 1 ' + trainInputFolder + SVMclass + 'scale ' + trainInputFolder + SVMclass + '.model', function (error, stdout, stderr) {
//                console.log('/Volumes/RamDisk/libsvm-3.17/svm-train -b 1 ' + trainInputFolder + SVMclass + 'scale ' + trainInputFolder + SVMclass + '.model');
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
    }

var func2 = function () {
    exec('/Volumes/RamDisk/libsvm-3.17/svm-scale -l 0 -u 1 ' + testDataPath + ' > ' + testDataScalePath, function (error, stdout, stderr) {
        

        predictLoop(postProcessing);
        
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
    //    execSync('/Volumes/RamDisk/libsvm-3.17/svm-scale -l 0 -u 1 ' + testDataPath + ' > ' +  testDataScalePath);
    //exeCmd('/Volumes/RamDisk/libsvm-3.17/svm-scale -l 0 -u 1 ' + testDataPath + ' > ' +  testDataScalePath);

}

func1(func2);

function predict(i) {
    exec('/Volumes/RamDisk/libsvm-3.17/svm-predict -b 1 ' + testDataScalePath + ' ' + trainInputFolder + i + '.model ' + trainInputFolder + 'result' + i, function (error, stdout, stderr) {
//console.log('/Volumes/RamDisk/libsvm-3.17/svm-predict -b 1 ' + testDataScalePath + ' ' + trainInputFolder + i + '.model ' + trainInputFolder + 'result' + i);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}

function predictLoop(callback){
    for (var i = 1; i <= 26; i++) {
            predict(i);
        }
    (callback && typeof (callback) === "function") && callback();
}

function postProcessing(){
    scaledTestData = fs.readFileSync(testDataScalePath).toString().split('\n');
for(var i=0; i<scaledTestData.length; i++){
    console.log(scaledTestData[i].split(' ')[0]);
}
    var results = new Array();
for(var i=1; i<=26 ;i++){
    results[i] = fs.readFileSync(trainInputFolder + 'result' + i).toString().split('\n');  
}


console.log(results[1][1].split(' ')[0]);
console.log(results[1][1].split(' ')[1]);
console.log(results[1][1].split(' ')[2]);
}



//var func3 = function (callback) {
//    (callback && typeof (callback) === "function") && callback();
//}
//
//var func4 = function () {
//    
//}
//
//func3(func4);

//console.log(results[26]);


function writeToFile(data, filepath) {
    fs.writeFileSync(filepath, data);
}

function appendToFile(data, filepath) {
    fs.appendFileSync(filepath, data);
}