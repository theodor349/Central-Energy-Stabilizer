const da = require('./DatabaseAccessorGraph.js');
const util = require('./Utilities.js');
const scale = 1000;
const lift = 100;
/*
    Graphs it works with
        apiDemand
        apiProduction
*/

updateApiGraphs(new Date());
setTimeout(() => {
    updateApiGraphs(new Date());
}, (1000*60*60));

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
            values[m] = getDemandAt(d * 24 + h + m / 60);
        }

        let id = util.dateToId("apiDemand", date);
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
            values[m] = getProdutionAt(d * 24 + h + m / 60);
        }

        let id = util.dateToId("apiProduction", date);
        let res = await da.updateGraph(id, values, false);
        resolve(res);
    })
}

function getSurplusAt(x) {
    return getProdutionAt(x) - getDemandAt(x);
}

/*
    Math Functions
*/


function getDemandAt(x) {
    return (Math.sin(0.9 * x - 5) * 2.2 +
        Math.sin(1.4 * x - 0.2) * 1.3 +
        Math.sin(2.1 * x - 2) * 2.8 + lift) * scale;
}

function getProdutionAt(x) {
    return (Math.sin(2.7 * x + 3.3) * 0.8 +
        Math.sin((-0.5) * x + 1) * 2.7 +
        Math.sin(Math.sin(2.1 * x - 2) * 2.8) + lift) * scale;
}