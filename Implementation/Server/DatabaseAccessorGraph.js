'use strict';
const mongoose = require('mongoose');
const utility = require('./Utilities.js');

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
}

async function dropDatabase() {
    // Clear the database every time. This is for the sake of example only,
    // don't do this in prod :)
    return new Promise(async (resolve, reject) => {
        await mongoose.connection.dropDatabase();
        resolve(true);
    })
}

/*
    SECTION: Interface Functions
*/

const functions = {
    // For testing and deployment
    createGraph: (graph) => createGraph(graph),
    getGraph: (id) => getGraph(id),
    updateGraph: (id, values, shouldAdd) => updateGraph(id, values, shouldAdd),
    dropDatabase: () => dropDatabase(),
}

module.exports = functions;

async function createGraph(graph) {
    if (!isGraphValid(graph)) {
        return null;
    }

    let serializedGraph = serializeGraph(graph);
    return new Promise((resolve, reject) => {
        try {
            const graphModel = new Graph({
                graphId: serializedGraph.graphId,
                values: serializedGraph.values
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
        getExistingGraph(id)
            .then(async (graph) => {
                if (graph === null) {
                    graph = createDefaultGraph(id);
                    graph = await createGraph(graph);
                    resolve(deserializeGraph(graph));
                } else {
                    resolve(deserializeGraph(graph));
                }
            })
            .catch((err) => {
                reject(err);
            })
    });
}

async function getExistingGraph(id) {
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

async function updateGraph(id, points, shouldSum) {
    if (!isPointsValid(points)) {
        return false;
    }

    return new Promise(async (resolve, reject) => {
        getExistingGraph(id)
            .then(async (graph) => {
                let values = await createNewGraphIfNonExisting(graph, id);
                values = utility.updateValues(values, points, shouldSum);

                sendUpdateCommand(id, values)
                    .then((val) => {
                        resolve(val);
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
            .catch((err) => {
                reject(err);
            })
    });
}

async function sendUpdateCommand(id, values) {
    return new Promise(async (resolve, reject) => {
        // Set update variables
        let conditions = {
            graphId: id
        };
        let update = {
            values: JSON.stringify(values)
        };
        let options = {};

        // Update
        Graph.updateOne(conditions, update, options, (err, success) => {
            if (err) {
                reject(err);
            }

            if (success.ok === 1 && success.n === 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

/*
    SECTION: Helper Functions
*/

async function createNewGraphIfNonExisting(graph, id) {
    return new Promise(async (resolve, reject) => {
        let values;
        if (graph === null) {
            graph = createDefaultGraph(id);
            values = graph.values;
            await createGraph(graph);
        } else {
            values = JSON.parse(graph.values);
        }
        resolve(values);
    });
}

function createDefaultGraph(id) {
    let values = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    let graph = {
        graphId: id,
        values: values
    };
    return graph;
}

function isGraphValid(graph) {
    return graph.values.length === 60
}

function serializeGraph(graph) {
    graph.values = JSON.stringify(graph.values);
    return graph;
}

function deserializeGraph(graph) {
    graph = graph.toObject({
        getters: true,
        virtuals: true
    });
    graph.values = JSON.parse(graph.values);
    return graph;
}

function isPointsValid(points) {
    return points.length === 60;
}