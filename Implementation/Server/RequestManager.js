/*
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
        
        
        // Checks if the device is already scheduled
        if (isScheduled === true) {
            forecaster.removeDemand(); //Husk parametre
        }
        else if (isScheduled === false) {
            gatherSurplusGraph();
        } 
        resolve(outputIntervalObject);
    });
}
*/