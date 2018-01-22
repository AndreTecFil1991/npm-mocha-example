var fs = require('fs');
var moment = require('moment');

//array to store inputFile processed records
var records = [];
//costs per minute
var first5MinutesCost = 0.05;
var remainingMinutesCost = 0.02;

function processRecords() {
    var validTimes = true;
    var recordsWithCallDuration = [];
    //use of reduce to iterate the original array and iterate the new one with caller validation
    Object.keys(records).reduce(function (previous, current) {
        var currentRecord = records[current];
        var time_of_start = currentRecord.time_of_start;
        var time_of_finish = currentRecord.time_of_finish;

        var caller = currentRecord.call_from;
        var callerIndex = recordsWithCallDuration.findIndex(i => i.caller === caller);
        //save calls duration in milliseconds
        var milliseconds = moment(time_of_finish, 'hh:mm:ss') - moment(time_of_start, 'hh:mm:ss');
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

    }, {});

    //sort ascendly the processed results (the last one it will be "ignored" since it's the caller with the highest call duration of the day)
    const recordsWithCallDurationSorted = recordsWithCallDuration.sort((a, b) => {
        return a.callDuration - b.callDuration;
    });

    var totalCost = 0.00;
    for (record in recordsWithCallDurationSorted) {
        var callDuration = recordsWithCallDurationSorted[record].callDuration;

        if (record < recordsWithCallDurationSorted.length - 1) {
            var minutes = moment.duration(callDuration).hours() * 60 + moment.duration(callDuration).minutes();

            if (moment.duration(callDuration).seconds() > 0)
                minutes++;

            totalCost += minutes > 5 ? first5MinutesCost * 5 + (minutes - 5) * remainingMinutesCost : minutes * first5MinutesCost;
        }
    }

    // use of toFix(2) to show allways 2 decimal places
    var result = '\n' + totalCost.toFixed(2) + '\n';
    return result;

}

function convertLinesToRecords(line) {
    var parts = line.split(';');
    //check if each line has 4 parameters splitted by ; and return -1 in case of invalid records
    if (parts.length != 4) {
        return -1;
    } else {
        records.push({
            time_of_start: parts[0],
            time_of_finish: parts[1],
            call_from: parts[2],
            call_to: parts[3]
        })
        return 0;
    }
}

function readFileLines(inputFile, callback = null) {
    var input = fs.createReadStream(inputFile);
    var remaining = "";
    records = [];
    input.on("data", function (data) {
        remaining += data;
        var lineIndex = remaining.indexOf("\n");
        //boolean to store the validity of inputFile records
        var validRecords = true;
        while (lineIndex > -1) {
            var line = remaining.substring(0, lineIndex);
            remaining = remaining.substring(lineIndex + 1);

            if (convertLinesToRecords(line) != 0) {
                validRecords = false;
                break;
            }
            lineIndex = remaining.indexOf("\n");
        }
        //if all the records are valid we proceed to the next call, otherwise it's presented the log bellow and the program is finished
        if (validRecords) {
            var result = processRecords();
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