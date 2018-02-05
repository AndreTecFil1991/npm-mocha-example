const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const moment = require('moment');

function processRecords(records) {
    const hourFormat = 'hh:mm:ss';
    let recordsWithCallDuration = [];
    //use of reduce to iterate the original array and iterate the new one with caller validation

    records.forEach(el => {
        let currentRecord = el;
        let caller = currentRecord.callFrom;
        let callerIndex = recordsWithCallDuration.findIndex(i => i.caller === caller);
        //times in milliseconds
        let startTime = moment(currentRecord.startTime, hourFormat);
        let finishTime = moment(currentRecord.finishTime, hourFormat);
        //midnight tim in milliseconds to calculate over midnight calls
        let midnightTime = moment('23:59:59', hourFormat);

        //process calls duration in milliseconds
        let milliseconds = finishTime > startTime ? finishTime - startTime : midnightTime - startTime + finishTime;
        //check if the caller already exists in recordsWithCallDuration, if exists we update the callDuration, if don't we create add a new object to the array
        if (callerIndex > -1) {
            recordsWithCallDuration[callerIndex].callDuration += milliseconds;
        } else {
            recordsWithCallDuration.push(
                {
                    caller: caller,
                    callDuration: milliseconds
                }
            );
        }
    })

    //sort ascendly the processed results (the last one it will be "ignored" since it's the caller with the highest call duration of the day)
    const recordsWithCallDurationSorted = recordsWithCallDuration.sort((a, b) => {
        return a.callDuration - b.callDuration;
    });

    let totalCost = 0.00;
    for (record in recordsWithCallDurationSorted) {
        let callDuration = recordsWithCallDurationSorted[record].callDuration;

        if (record < recordsWithCallDurationSorted.length - 1) {
            let minutes = moment.duration(callDuration).hours() * 60 + moment.duration(callDuration).minutes();
            //costs per minute
            let first5MinutesCost = 0.05;
            let remainingMinutesCost = 0.02;

            if (moment.duration(callDuration).seconds() > 0)
                minutes++;

            totalCost += minutes > 5 ? first5MinutesCost * 5 + (minutes - 5) * remainingMinutesCost : minutes * first5MinutesCost;
        }
    }

    // use of toFix(2) to show allways 2 decimal places
    let result = totalCost.toFixed(2) + '\n';
    return result;

}

function convertLinesToRecords(line) {
    let parts = line.split(';');
    //check if each line has 4 parameters splitted by ; and return null in case of invalid records
    if (parts.length != 4) {
        return null;
    } else {
        return {
            startTime: parts[0],
            finishTime: parts[1],
            callFrom: parts[2],
            callTo: parts[3]
        }
    }
}

function readFileLines(inputFile, callback = null) {
    let instream = fs.createReadStream('files/' + inputFile);
    let outstream = new stream;
    let rl = readline.createInterface(instream, outstream);
    let records = [];
    let validRecords = true;
    rl.on('line', function (line) {
        let convertedLine = convertLinesToRecords(line)

        if (convertedLine) {
            records.push(convertedLine);
        } else {
            validRecords = false;
            rl.close();
        }
    });
    rl.on('close', function () {
        if (validRecords) {
            const result = processRecords(records);
            if (callback)
                callback(result);
            else
                return result;
        } else {
            const message = '\nThe given file has some invalid record\n';
            if (callback)
                callback(message);
            else
                return message;
        }
    });
}

module.exports = readFileLines;