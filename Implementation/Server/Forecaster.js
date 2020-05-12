/*
    Graphs it works with
        deviceDemand
        surplus
*/

const da = require('./DatabaseAccessorGraph.js');
const utility = require('./Utilities.js');

const functions = {
    updateSurplus: (interval) => updateSurplus(interval),
    addDemand: (startTime, graph) => addDemand(startTime, graph),
    removeDemand: (startTime, graph) => removeDemand(startTime, graph),
    invertValues: (values) => invertValues(values),
    splitGraph: (startTime, graph) => splitGraph(startTime, graph),
}
module.exports = functions;

async function updateSurplus(interval) {
    return new Promise(async (resolve, reject) => {
        let surplusStartTime = new Date();
        surplusStartTime.setTime(interval.start.getTime());

        let graph = [];

        let hoursInInterval = (interval.finish.getTime() -
            interval.start.getTime()) / (60 * 60 * 1000);

        for (let i = 0; i < hoursInInterval + 1; i++) {
            await updateSurplusGraph(surplusStartTime);

            let updatedSurplus = await da.getGraph(utility.dateToId("surplusGraph", surplusStartTime));
            for (let t = 0; t < 60; t++) {
                graph.push(updatedSurplus.values[t]);
            }
            surplusStartTime.setTime(surplusStartTime.getTime() + 60 * 60 * 1000);
        }
        resolve(graph);
    });
}

async function addDemand(startTime, graph) {
    return new Promise(async (resolve, reject) => {
        let lowerGraph = {
            graphId: undefined,
            values: []
        };
        let upperGraph = {
            graphId: undefined,
            values: []
        };
        let demandGraphs = {};
        let secondGraphStartTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        let graphToSplit = [];

        for (i = 0; graph.length > 60; i++) {
            graphToSplit = await createGraphToSplit(graph);

            demandGraphs = splitGraph(startTime, graphToSplit);
            lowerGraph.graphId = await utility.dateToId("demandGraph", startTime);
            upperGraph.graphId = await utility.dateToId("demandGraph", secondGraphStartTime);
            lowerGraph.values = demandGraphs.demandGraphLower;
            upperGraph.values = demandGraphs.demandGraphUpper;

            await updateDemandGraph(lowerGraph);
            await updateDemandGraph(upperGraph);
            await updateSurplusGraph(startTime);

            startTime.setTime(startTime.getTime() + 60 * 60 * 1000);
            secondGraphStartTime.setTime(startTime.getTime() + 60 * 60 * 1000);
        }
        demandGraphs = splitGraph(startTime, graph);
        // Puts the graphId and values into the lower and upper bound graphs
        lowerGraph.graphId = await utility.dateToId("demandGraph", startTime);
        upperGraph.graphId = await utility.dateToId("demandGraph", secondGraphStartTime);
        lowerGraph.values = demandGraphs.demandGraphLower;
        upperGraph.values = demandGraphs.demandGraphUpper;

        await updateDemandGraph(lowerGraph);
        await updateDemandGraph(upperGraph);
        await updateSurplusGraph(startTime);
        await updateSurplusGraph(secondGraphStartTime);

        resolve(true);
    });
}

async function removeDemand(startTime, graph) {
    return new Promise(async (resolve, reject) => {
        graph = invertValues(graph);

        await addDemand(startTime, graph);
        /*
        let lowerGraph = {
            graphId: undefined,
            values: []
        };
        let upperGraph = {
            graphId: undefined,
            values: []
        };
        let demandGraphs = {};
        let secondGraphStartTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        let graphToSplit = [];
        for (i = 0; graph.length > 60; i++) {
            graphToSplit = await createGraphToSplit(graph);
            demandGraphs = splitGraph(startTime, graphToSplit);
            lowerGraph.graphId = await utility.dateToId("demandGraph", startTime);
            upperGraph.graphId = await utility.dateToId("demandGraph", secondGraphStartTime);
            lowerGraph.values = demandGraphs.demandGraphLower;
            upperGraph.values = demandGraphs.demandGraphUpper;
            lowerGraph.values = invertValues(lowerGraph.values);
            upperGraph.values = invertValues(upperGraph.values);

            await updateDemandGraph(lowerGraph);
            await updateDemandGraph(upperGraph);
            await updateSurplusGraph(startTime);

            startTime.setTime(startTime.getTime() + 60 * 60 * 1000);
            secondGraphStartTime.setTime(startTime.getTime() + 60 * 60 * 1000);
        }
        demandGraphs = splitGraph(startTime, graph);
        // Puts the graphId and values into the lower and upper bound graphs
        lowerGraph.graphId = await utility.dateToId("demandGraph", startTime);
        upperGraph.graphId = await utility.dateToId("demandGraph", secondGraphStartTime);
        lowerGraph.values = demandGraphs.demandGraphLower;
        upperGraph.values = demandGraphs.demandGraphUpper;
        lowerGraph.values = invertValues(lowerGraph.values);
        upperGraph.values = invertValues(upperGraph.values);

        if (isGraphValid(lowerGraph.values) !== true && isGraphValid(upperGraph.values) !== true) {
            reject(err);
        }

        await updateDemandGraph(lowerGraph);
        await updateDemandGraph(upperGraph);
        await updateSurplusGraph(startTime);
        await updateSurplusGraph(secondGraphStartTime);
        */
        resolve(true);
    });
}

/*
Helper functions
*/

async function updateSurplusGraph(surplusStartTime) {
    return new Promise(async (resolve, reject) => {
        let demandGraph = await da.getGraph(utility.dateToId("demandGraph", surplusStartTime));
        let apiProductionGraph = await da.getGraph(
            utility.dateToId("apiProduction", surplusStartTime));
        let apiDemandGraph = await da.getGraph(utility.dateToId("apiDemand", surplusStartTime));
        let surplusGraph = {
            graphId: undefined,
            values: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ]
        };

        demandGraph.values = invertValues(demandGraph.values);
        apiDemandGraph.values = invertValues(apiDemandGraph.values);

        surplusGraph.graphId = utility.dateToId("surplusGraph", surplusStartTime);

        surplusGraph.values = await utility.updateValues(
            surplusGraph.values, apiProductionGraph.values, true);

        surplusGraph.values = await utility.updateValues(
            surplusGraph.values, apiDemandGraph.values, true);

        surplusGraph.values = await utility.updateValues(
            surplusGraph.values, demandGraph.values, true);

        await da.updateGraph(surplusGraph.graphId, surplusGraph.values, false);
        resolve(true);
    });
}

function updateDemandGraph(graph) {
    return new Promise(async (resolve, reject) => {

        let res = await da.updateGraph(graph.graphId, graph.values, true);
        resolve(res);
    });
}

function invertValues(values) {
    for (i = 0; i < values.length; i++) {
        values[i] *= -1;
    }
    return values;

}

function isGraphValid(graph) {
    return (typeof(graph) === "object");
}

function splitGraph(startTime, graph) {
    let t = 0;
    let startTimeMinutes = startTime.getMinutes();
    let demandGraphs = {
        demandGraphLower: [],
        demandGraphUpper: []
    };

    // Splits the graph into two, according to startTime. Puts zeroes on either side.
    for (i = graph.length; i < 60; i++) {
        graph.push(0);
    }

    for (i = 0; i < startTimeMinutes; i++) {
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

async function createGraphToSplit(graph) {
    return new Promise(async (resolve, reject) => {
        let graphToSplit = [];
        for (t = 0; t < 60; t++) {
            graphToSplit[t] = graph[0];
            graph.shift();
        }

        resolve(graphToSplit);
    });
}

let testIntervalObject = {
    start: new Date(2010, 1, 24, 18, 24),
    finish: new Date(2010, 1, 24, 20, 24)
};

let testGraph = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 38, 39, 50,
    51, 52, 53, 54, 55, 56, 57, 58, 59, 60
];

//addDemand(testIntervalObject.start, testGraph);
//removeDemand(testIntervalObject.finish, testGraph);

//updateSurplus(testIntervalObject);