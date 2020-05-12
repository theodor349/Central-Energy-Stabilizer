const forecaster = require('./Forecaster.js');

const functions = {
    requestTimeToRun: (graph, timeIntervalObject) => requestTimeToRun(graph, timeIntervalObject),
    removeCurrentDemand: (currentSchedule, graph) => removeCurrentDemand(currentSchedule, graph),
}

module.exports = functions;

function requestTimeToRun (graph, timeIntervalObject) {
    return new Promise(async (resolve, reject) => {
        let outputIntervalObject = {
            start: undefined,
            end: undefined
        };
        
        // TODO: Nedenstående linje virker ikke endnu (derfor kommenteret ud)
        //let gatheredSurplusGraph = gatherSurplusGraph();
        fitDemandToSurplus(outputIntervalObject, timeIntervalObject, graph);

        await forecaster.addDemand(outputIntervalObject.start, graph);

        resolve(outputIntervalObject);
    });
}

function removeCurrentDemand (currentSchedule, graph) {
    return new Promise(async (resolve, reject) => {
        await forecaster.removeDemand(currentSchedule.start, graph);
        
        resolve(true);
    });
}

/* 
    SECTION: Helper functions
*/ 

function gatherSurplusGraph(startTime) { // TODO: Parametre ændres nok
    return new Promise(async (resolve, reject) => {
        resolve(forecaster.updateSurplus(startTime));
    });
}

function fitDemandToSurplus(outputIntervalObject, timeIntervalObject, graph) {
    return new Promise(async (resolve, reject) => {
        outputIntervalObject.start = timeIntervalObject.start;
        
        // Adds graph length in minutes to interval start
        let finishTime = new Date();
        finishTime.setTime(timeIntervalObject.start.getTime() + (1000 * 60) * graph.length);

        outputIntervalObject.end = finishTime;

        resolve(true);
    });
}
