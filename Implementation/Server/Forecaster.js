/*
    Graphs it works with
        deviceDemand
        surplus
*/

const da = require('./DatabaseAccessorGraph.js');
const utility = require('./Utilities.js');

const functions = {
    updateSurplus: () => updateSurplus,
    addDemand: (startTime, graph) => addDemand(startTime, graph),
    removeDemand: (startTime, graph) => removeDemand(startTime, graph),
    invertValues: (demandGraphs) => invertValues(demandGraphs),
    splitGraph: (startTime, graph) => splitGraph(startTime, graph),
}
module.exports = functions;

async function updateSurplus(startTime) {
    return new Promise(async (resolve, reject) => {
        let demandGraph = da.getGraph(utility.dateToId("demandGraph", startTime));
        let apiProductionGraph = da.getGraph(
                                    utility.dateToId("apiProduction", startTime));
        let apiDemandGraph = da.getGraph(utility.dateToId("apiDemand", startTime));
        da.updateGraph(utility.dateToId("surplusGraph", startTime)), 

        resolve(true);
    });
}

async function addDemand(startTime, graph) {
    return new Promise(async (resolve, reject) => {
        let lowerGraph = { graphId: undefined, values: [] };
        let upperGraph = { graphId: undefined, values: [] };
        let demandGraphs = {};
        let secondGraphStartTime = new Date(startTime.getTime() + 60 * 60 * 1000);

        demandGraphs = splitGraph(startTime, graph);

        // Puts the graphId and values into the lower and upper bound graphs
        lowerGraph.graphId = await utility.dateToId("demandGraph", startTime);
        upperGraph.graphId = await utility.dateToId("demandGraph", secondGraphStartTime);
        lowerGraph.values = demandGraphs.demandGraphLower;
        upperGraph.values = demandGraphs.demandGraphUpper;

        await updateGraph(lowerGraph);
        await updateGraph(upperGraph);
        resolve(true);
    });
}

async function removeDemand(startTime, graph){
    return new Promise(async (resolve, reject) => {
        let lowerGraph = { graphId: undefined, values: [] };
        let upperGraph = { graphId: undefined, values: [] };
        let demandGraphs = {};
        let secondGraphStartTime = new Date(startTime.getTime() + 60 * 60 * 1000);

        demandGraphs = splitGraph(startTime, graph);
        demandGraphs = invertValues(demandGraphs);

        // Puts the graphId and values into the lower and upper bound graphs
        lowerGraph.graphId = await utility.dateToId("demandGraph", startTime);
        upperGraph.graphId = await utility.dateToId("demandGraph", secondGraphStartTime);
        lowerGraph.values = demandGraphs.demandGraphLower;
        upperGraph.values = demandGraphs.demandGraphUpper;

        await updateGraph(lowerGraph);
        await updateGraph(upperGraph);

        resolve(true);
    });
}

/*
Helper functions
*/

function updateGraph(graph) {
    return new Promise(async (resolve, reject) => {

        let res = await da.updateGraph(graph.graphId, graph.values, true);
        resolve(res);
    }); 
}

function invertValues(demandGraphs) {
    for (i = 0; i < 60; i++) {
        demandGraphs.demandGraphLower[i] *= -1;
        demandGraphs.demandGraphUpper[i] *= -1;
    }
    return demandGraphs;

}

function splitGraph(startTime, graph) {
    let t = 0; 
    let startTimeMinutes = startTime.getMinutes();
    let demandGraphs = {demandGraphLower: [], demandGraphUpper: [] };

    // Splits the graph into two, according to startTime. Puts zeroes on either side.
    for (i = graph.length; i < 60; i++) {
        graph.push(0);
    }

    for (i = 0; i < startTimeMinutes; i++){
        demandGraphs.demandGraphLower[i] = 0;
    }

    for (i = startTimeMinutes, t = 0; i < 60; i++, t++) {
        demandGraphs.demandGraphLower[i] = graph[t];
    }

    for (i = 0, t; t < 60; i++, t++) {
        demandGraphs.demandGraphUpper[i] = graph[t];
    }

    for (i; i < 60; i++) {
        demandGraphs.demandGraphUpper[i] = 0;
    }

    return demandGraphs;
}


let testStartTime = new Date(2010, 1, 24, 15, 24);

testGraph = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                41, 42, 43, 44, 45, 46, 47, 38, 39, 50,
                51, 52, 53, 54, 55, 56, 57, 58, 59, 60 ];

addDemand(testStartTime, testGraph);
removeDemand(testStartTime, testGraph);

