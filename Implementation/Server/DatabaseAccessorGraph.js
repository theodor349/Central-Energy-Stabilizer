'use strict';
const mongoose = require('mongoose');

let Graph = mongoose.model("Graphs", new mongoose.Schema({
    graphId: String,
    values: String
}));

/*
    SECTION: Setup Functions
*/

run('mongodb://localhost:27017/P2Test').catch(error => console.log(error.stack));
async function run(connectionString) {
    await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    //test();
}

async function dropDatabase() {
    // Clear the database every time. This is for the sake of example only,
    // don't do this in prod :)
    await mongoose.connection.dropDatabase();
}

// TODO: Remove tests
function test() {
    dropDatabase();
}

/*
    SECTION: Interface Functions
*/

const functions = {
    // For testing and deployment
    createGraph: (graph) => createGraph(graph),
    getGraph: (id) => getGraph(id),
    updateGraph: (id, startIndex, values) => updateGraph(id, startIndex, values),
    dropDatabase: () => dropDatabase(),
}

module.exports = functions;

async function createGraph(graph) {
    if (!isGraphValid(graph)) {
        return null;
    }

    let serilizedGraph = serilizeGraph(graph);
    return new Promise((resolve, reject) => {
        try {
            const graphModel = new Graph({
                graphId: serilizedGraph.graphId,
                values: serilizedGraph.values
            });
            graphModel.save((saveError, savedUser) => {
                if (saveError)
                    reject(saveError);
                else
                    resolve(savedUser);
            });
        } catch (err) {
            reject(err);
        }
    });
}

async function getGraph(id) {
    return new Promise((resolve, reject) => {
        getDeviceHelper(id)
            .then((graph) => {
                if (graph === null)
                    resolve(null)
                else
                    resolve(deserilizeGraph(graph));
            })
            .catch((err) => {
                reject(err);
            })
    });
}

async function getDeviceHelper(id) {
    return new Promise((resolve, reject) => {
        try {
            Graph.findOne({
                graphId: id
            }, (err, res) => {
                if (err)
                    reject(err);
                else {
                    if (res !== null)
                        resolve(res);
                    else
                        resolve(null);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

function updateGraph(id, startIndex, values) {
    if (!validUpdate(startIndex, values))
        return false;


}

/*
    SECTION: Helper Functions
*/

function isGraphValid(graph) {
    return graph.values.length === 60
}

function serilizeGraph(graph) {
    graph.values = JSON.stringify(graph.values);
    return graph;
}

function deserilizeGraph(graph) {
    graph = graph.toObject({
        getters: true,
        virtuals: true
    });
    graph.values = JSON.parse(graph.values);
    return graph;
}

function validUpdate(startIndex, values) {
    if (startIndex < 0 || startIndex >= 60) return false;
    return startIndex + values.length < 60;
}

/*
    TODO: Remove
          For testing only
*/

// Graphs
function createGraphPrototype() {
    let values = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
        40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    ];

    let graph = {
        graphId: "id",
        values: values
    };
    return graph;
}