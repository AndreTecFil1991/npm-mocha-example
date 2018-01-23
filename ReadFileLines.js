function processRecords(records) {
    const moment = require('moment');
    var recordsWithCallDuration = [];
    //use of reduce to iterate the original array and iterate the new one with caller validation

    records.forEach(el => {
        var currentRecord = el;
        var caller = currentRecord.call_from;
        var callerIndex = recordsWithCallDuration.findIndex(i => i.caller === caller);
        //times in milliseconds
        var time_of_start = moment(currentRecord.time_of_start, 'hh:mm:ss');
        var time_of_finish = moment(currentRecord.time_of_finish, 'hh:mm:ss');
        //midnight tim in milliseconds to calculate over midnight calls
        var midnight_time = moment('23:59:59', 'hh:mm:ss');

        //process calls duration in milliseconds
        var milliseconds = time_of_finish > time_of_start ? time_of_finish - time_of_start : midnight_time - time_of_start + time_of_finish;
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

    var totalCost = 0.00;
    for (record in recordsWithCallDurationSorted) {
        var callDuration = recordsWithCallDurationSorted[record].callDuration;

        if (record < recordsWithCallDurationSorted.length - 1) {
            var minutes = moment.duration(callDuration).hours() * 60 + moment.duration(callDuration).minutes();
            //costs per minute
            var first5MinutesCost = 0.05;
            var remainingMinutesCost = 0.02;

            if (moment.duration(callDuration).seconds() > 0)
                minutes++;

            totalCost += minutes > 5 ? first5MinutesCost * 5 + (minutes - 5) * remainingMinutesCost : minutes * first5MinutesCost;
        }
    }

    // use of toFix(2) to show allways 2 decimal places
    var result = totalCost.toFixed(2) + '\n';
    return result;

}

function convertLinesToRecords(line) {
    var parts = line.split(';');
    //check if each line has 4 parameters splitted by ; and return null in case of invalid records
    if (parts.length != 4) {
        return null;
    } else {
        return {
            time_of_start: parts[0],
            time_of_finish: parts[1],
            call_from: parts[2],
            call_to: parts[3]
        }
    }
}

function readFileLines(inputFile, callback = null) {
    var fs = require('fs');
    var readline = require('readline');
    var stream = require('stream');
    var instream = fs.createReadStream(inputFile);
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);
    let records = [];
    var validRecords = true;
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
            var result = processRecords(records);
            if (callback)
                callback(result);
            else
                return result;
        } else {
            var message = '\nThe given file has some invalid record\n';
            if (callback)
                callback(message);
            else
                return message;
        }
    });
}

module.exports = readFileLines;