const fs = require('fs');
const readFileLines = require('./ReadFileLines');

function printResult(result) {
    console.log('\nTotal Cost: ' + result);
}

function processInput(inputFile, callback = null) {
    if (inputFile) {
        const fileToCheck = 'files/' + inputFile
        //check if the given inputFile exists as a file
        fs.stat(fileToCheck, (err) => {
            console.log(err)
            if (err === null) {
                readFileLines(inputFile, printResult)
            } else if (err.code === 'ENOENT') {
                const message = '\nThe requested file does not exist\n';
                if (callback && typeof callback === 'function')
                    return callback(message);
                else
                    console.log(message);
            } else {
                console.log(err.Error)
            }
        })
    } else {
        const message = '\nPlease provide an input file\n';
        if (callback && typeof callback === 'function')
            return callback(message);
        else
            console.log(message);
    }
}

module.exports = processInput;