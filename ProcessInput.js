var fs = require('fs');
var readFileLines = require('./ReadFileLines');

function printResult(result) {
    console.log('\nTotal Cost: ' + result);
}

function processInput(inputFile, callback = null) {
    if (inputFile) {
        //check if the given inputFile exists as a file
        fs.stat(inputFile, (err) => {
            if (err === null) {
                readFileLines(inputFile, printResult)
            } else if (err.code === 'ENOENT') {
                var message = '\nThe requested file does not exist\n';
                if (callback)
                    return message;
                else
                    console.log(message);
            }
        })
    } else {
        var message = '\nPlease provide an input file\n';
        if (callback)
            return message;
        else
            console.log(message);
    }
}

module.exports = processInput;