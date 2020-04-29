
// Not finished, very early stages 

const forecaster = require('./Forecaster.js');

const functions = {
    requestTimeToRun: (graph, isScheduled, timeIntervalObject) => requestTimeToRun(graph, isScheduled, timeIntervalObject),
}

module.exports = functions;

// 3 parameters: Graph (ex. 3 points), boolean (isScheduled), time interval

function requestTimeToRun (graph, isScheduled, timeIntervalObject) {
    return new Promise(async (resolve, reject) => {
        let outputIntervalObject = {
            outputIntervalStart: undefined,
            outputIntervalFinish: undefined
        };
        
       resolve(outputIntervalObject);
    });
}

function gatherSurplusGraph() {
    return new Promise(async (resolve, reject) => {
        forecaster.updateSurplus();
    });
}

