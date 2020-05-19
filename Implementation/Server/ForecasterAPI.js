const da = require('./DatabaseAccessorGraph.js');
const util = require('./Utilities.js');
const forecaster = require('./Forecaster.js');
const scale = 100000;
const lift = 100;
/*
    Graphs it works with
        apiDemand
        apiProduction
*/
update();
setTimeout(() => {
    update();
}, (1000 * 60 * 60));

async function update() {
    let startDate = new Date();
    startDate.setHours(0);
    startDate.setMinutes(0);
    await updateApiGraphs(startDate);

    startDate = new Date();
    startDate.setHours(0);
    startDate.setMinutes(0);
    let finishDate = new Date();
    finishDate.setHours(0);
    finishDate.setMinutes(0);
    finishDate.setDate(finishDate.getDate() + 2);

    let interval = {
        start: startDate,
        finish: finishDate,
    }
    forecaster.updateSurplus(interval);
}

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
        for (var i = 0; i < 48; i++) {
            updateApiProduction(date);
            updateApiDemand(date);
            updateApiSurplus(date);
            date.setTime(date.getTime() + 60 * 60 * 1000);
        }
        await updateApiProduction(date);
        await updateApiDemand(date);
        resolve(true);
    })
}

async function updateApiSurplus(date) {
    return new Promise(async (resolve, reject) => {
        let values = new Array(60);
        let d = date.getDate();
        let h = date.getHours();
        for (var m = 0; m < 60; m++) {
            values[m] = getProdutionAt(d * 24 + h + m / 60) - getDemandAt(d * 24 + h + m / 60);
        }

        let id = util.dateToId("apiSurplusGraph", date);
        let res = await da.updateGraph(id, values, false);
        resolve(res);
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
