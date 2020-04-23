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
}

async function dropDatabase() {
    // Clear the database every time. This is for the sake of example only,
    // don't do this in prod :)
    await mongoose.connection.dropDatabase();
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
        getGraphHelper(id)
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

async function getGraphHelper(id) {
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

async function updateGraph(id, points, shouldAdd) {
    if (!validUpdate(points))
        return false;

    return new Promise(async (resolve, reject) => {
        getGraphHelper(id)
            .then((graph) => {
                // Check
                if (graph === null)
                    resolve(false);


                // Update Values
                let values = JSON.parse(graph.values);
                if (shouldAdd) {
                    for (let i = 0; i < points.length; i++) {
                        if (points[i] === 'n')
                            continue;
                        values[i] += points[i];
                    }
                } else {
                    for (let i = 0; i < points.length; i++) {
                        if (points[i] === 'n')
                            continue;
                        values[i] = points[i];
                    }
                }

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
                    if (err)
                        reject(err);
                    if (success.ok === 1)
                        resolve(true);
                    else
                        resolve(false);
                });
            })
            .catch((err) => {
                reject(err);
            })
    });
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

function validUpdate(values) {
    return values.length === 60;
}