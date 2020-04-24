const da = require('./DatabaseAccessorGraph.js');
/*
    Graphs it works with
        apiDemand
        apiProduction
*/

const functions = {
    // For deployment
    updateApiGraphs: (date) => updateApiGraphs(date),
    updateApiDemand: (date) => updateApiDemand(date),
    updateApiProduction: (date) => updateApiProduction(date),
    // For testing
    getSurplusAt: (x) => getSurplusAt(x),
    getDemandAt: (x) => getDemandAt(x),
    getProdutionAt: (x) => getProdutionAt(x),
}
module.exports = functions;

updateApiGraphs(new Date());
async function updateApiGraphs(date) {
    return new Promise(async (resolve, reject) => {
        for (var i = 0; i < 24; i++) {
            updateApiProduction(date);
            updateApiDemand(date);
            date.setTime(date.getTime() + 60 * 60 * 1000);
        }
        await updateApiProduction(date);
        await updateApiDemand(date);
        resolve(true);
    })
}

async function updateApiDemand(date) {
    return new Promise(async (resolve, reject) => {
        let values = new Array(60);
        let d = date.getDate();
        let h = date.getHours();
        for (var m = 0; m < 60; m++) {
            values[m] = getDemandAt(d * 24 + h + m * 60 / 100);
        }

        let id = dateToId("apiDemand", date);
        let res = await da.updateGraph(id, values, false);
        resolve(res);
    })
}

async function updateApiProduction(date) {
    return new Promise(async (resolve, reject) => {
        let values = new Array(60);
        let d = date.getDate();
        let h = date.getHours();
        for (var m = 0; m < 60; m++) {
            values[m] = getProdutionAt(d * 24 + h + m * 60 / 100);
        }

        let id = dateToId("apiProduction", date);
        let res = await da.updateGraph(id, values, false);
        resolve(res);
    })
}

function getSurplusAt(x) {
    return getProdutionAt(x) - getDemandAt(x);
}

/*
    Helper functions
*/

function dateToId(prefix, date) {
    return prefix +
        "-Y" + date.getFullYear() +
        "-M" + date.getMonth() +
        "-D" + date.getDate() +
        "-H" + date.getHours();
}

/*
    Math Functions
*/

let d = 24;
let h = 15;
let m = 54;
console.log("m: " + m + " = " + getProdutionAt(d * 24 + h + m * 60 / 100));

function getDemandAt(x) {
    return Math.sin(0.9 * x - 5) * 2.2 + Math.sin(1.4 * x - 0.2) * 1.3 + Math.sin(2.1 * x - 2) * 2.8;
}

function getProdutionAt(x) {
    return Math.sin(2.7 * x + 3.3) * 0.8 + Math.sin((-0.5) * x + 1) * 2.7 + Math.sin(Math.sin(2.1 * x - 2) * 2.8);
}