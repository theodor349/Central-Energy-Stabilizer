const forecaster = require('./Forecaster.js');

const functions = {
    requestTimeToRun: (graph, isScheduled, timeIntervalObject, currentSchedule) => requestTimeToRun(graph, isScheduled, timeIntervalObject, currentSchedule),
}

module.exports = functions;

// 3 parameters: Graph (ex. 3 points), boolean (isScheduled), time interval

function requestTimeToRun (graph, isScheduled, timeIntervalObject, currentSchedule) {
    return new Promise(async (resolve, reject) => {
        let outputIntervalObject = {
            outputIntervalStart: undefined,
            outputIntervalFinish: undefined
        };
        //Skal testes om isScheduled===false virker, efter removeDemand funktion er blevet testet.
        if (isScheduled === true) {
            forecaster.removeDemand(currentSchedule.timeIntervalStart, graph);
        }
        
        //Nedenstående linje virker ikke endnu (derfor kommenteret ud)
        //let gatheredSurplusGraph = gatherSurplusGraph();
        fitDemandToSurplus(outputIntervalObject, timeIntervalObject, graph);

        forecaster.addDemand(outputIntervalObject.outputIntervalStart, graph);

        resolve(outputIntervalObject);
    });
}

/* 
    Helper functions
*/ 

function gatherSurplusGraph(startTime) { //Parametre ændres nok
    return new Promise(async (resolve, reject) => {
        resolve(forecaster.updateSurplus(startTime));
    });
}

function fitDemandToSurplus(outputIntervalObject, timeIntervalObject, graph) {
    return new Promise(async (resolve, reject) => {
        outputIntervalObject.outputIntervalStart = timeIntervalObject.timeIntervalStart;
        
        // Adds graph length in minutes to interval start
        let finishTime = new Date();
        finishTime.setTime(timeIntervalObject.timeIntervalStart.getTime() + (1000 * 60) * graph.length);

        outputIntervalObject.outputIntervalFinish = finishTime;

        resolve(true);
    });
}

