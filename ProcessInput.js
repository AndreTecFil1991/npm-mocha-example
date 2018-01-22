var fs = require('fs');
var readFileLines = require('./ReadFileLines');

function printResult(result) {
    console.log(result);
}

function processInput(inputFile) {
    if (inputFile) {
        //check if the given inputFile exists as a file
        try {
            //synchronous call to work with callback
            fs.lstatSync(__dirname + '/' + inputFile).isFile();
            readFileLines(inputFile, printResult);
        } catch (e) {
            // Handle error in case of non existent file
            if (e.code == 'ENOENT') {
                console.log('\nThe requested file does not exist\n');
            }
        }
    } else {
        console.log('\nPlease provide an input file\n');
    }
}

module.exports = processInput;