var fs = require('fs');
var readFileLines = require('./ReadFileLines');

function printResult(result) {
    console.log(result);
}

function processInput(inputFile, callback = null) {
    if (inputFile) {
        //check if the given inputFile exists as a file
        try {
            //synchronous call to work with callback
            fs.lstatSync(__dirname + '/' + inputFile).isFile();
            readFileLines(inputFile, printResult);
        } catch (e) {
            // Handle error in case of non existent file
            if (e.code == 'ENOENT') {
                var message = '\nThe requested file does not exist\n';
                if (callback)
                    return message;
                else
                    console.log(message);
            }
        }
    } else {
        var message = '\nPlease provide an input file\n';
        if (callback)
            return message;
        else
            console.log(message);
    }
}

module.exports = processInput;