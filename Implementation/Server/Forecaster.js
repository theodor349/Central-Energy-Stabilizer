/*
    Graphs it works with
        deviceDemand
        surplus
*/

const da = require('./DatabaseAccessorGraph.js');

const functions = {
    updateSurplus: () => updateSurplus,
    addDemand: (startTime, graph) => addDemand(startTime, graph),
    removeDemand: (startTime, graph) => removeDemand(startTime, graph),
    invertValues: (demandGraphs) => invertValues(demandGraphs),
    splitGraph: (startTime, graph) => splitGraph(startTime, graph),
}
module.exports = functions;

function updateSurplus(graph) {
    console.log("graphId: " + graph.graphId);
    console.log("graph: " + graph.values);
    console.log("-------------");

    da.updateGraph(graph.graphId, graph.values, true);

}

function addDemand(startTime, graph) {

    lowerGraph = { graphId: undefined, values: [] };
    upperGraph = { graphId: undefined, values: [] };

    lowerGraph.graphId = "demandGraph-Y" + startTime.getFullYear() + 
                            "-M" + startTime.getMonth() + 
                            "-D" + startTime.getDate() +
                            "-H" + startTime.getHours();


    if (startTime.getMinutes() !== 0) {
        upperGraph.graphId = "demandGraph-Y" + startTime.getFullYear() + 
                            "-M" + startTime.getMonth() + 
                            "-D" + startTime.getDate() +
                            "-H" + (startTime.getHours()+1);
    }

    demandGraphs = splitGraph(startTime, graph);

    lowerGraph.values = demandGraphs.demandGraphLower;
    upperGraph.values = demandGraphs.demandGraphUpper;
    
//    updateSurplus(lowerGraph);
//    updateSurplus(upperGraph);

}

function removeDemand(startTime, graph){
    lowerGraph = { graphId: undefined, values: [] };
    upperGraph = { graphId: undefined, values: [] };

    lowerGraph.graphId = "demandGraph-Y" + startTime.getFullYear() + 
                            "-M" + startTime.getMonth() + 
                            "-D" + startTime.getDate() +
                            "-H" + startTime.getHours();

    console.log(lowerGraph.graphId);

    if (startTime.getMinutes() !== 0) {
        upperGraph.graphId = "demandGraph-Y" + startTime.getFullYear() + 
                            "-M" + startTime.getMonth() + 
                            "-D" + startTime.getDate() +
                            "-H" + (startTime.getHours()+1);
    }

    demandGraphs = splitGraph(startTime, graph);

    demandGraphs = invertValues(demandGraphs);

    lowerGraph.values = demandGraphs.demandGraphLower;
    upperGraph.values = demandGraphs.demandGraphUpper;

    updateSurplus(lowerGraph);
    updateSurplus(upperGraph);
}

function invertValues(demandGraphs){
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
//    console.log(demandGraphs.demandGraphLower);
//    console.log(demandGraphs.demandGraphUpper);

    return demandGraphs;
}

startTime = new Date(2010, 1, 24, 15, 24);

testGraph = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                41, 42, 43, 44, 45, 46, 47, 38, 39, 50,
                51, 52, 53, 54, 55, 56, 57, 58, 59, 60 ];

addDemand(startTime, testGraph);
removeDemand(startTime, testGraph);
