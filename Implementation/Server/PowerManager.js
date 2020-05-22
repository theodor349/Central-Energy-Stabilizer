'use strict';
const forecaster = require("./Forecaster.js");
const dbG = require("./DatabaseAccessorGraph.js");
const util = require("./Utilities.js");

const functions = {
    addToDemand: (device) => addToDemand(device),
    manageStats: (device) => manageStats(device),
    getAvoidedPeaker: () => getAvoidedPeaker(),
    getEnergyStored: () => getEnergyStored(),
    setTicksPrHour: (ticksPerHour) => setTicksPrHour(ticksPerHour),
    setBaseLoad: (baseLoad) => setBaseLoad(baseLoad),
}
module.exports = functions;

let baseLoad;
let ticksPerHour;

async function addToDemand(device) {
    return new Promise(async (resolve, reject) => {
        if (device.currentState === "on") {
            await forecaster.addDemand(new Date(), [device.currentPower]);
            resolve(true);
        } else {
            resolve(false);
        }
    })
}

async function manageStats(device) {
    return new Promise(async (resolve, reject) => {
        let date = new Date();
        let surplusGraph = await dbG.getGraph(util.dateToId("surplusGraph", date));
        if (surplusGraph.values[date.getMinutes()] > 0) {
            resolve(handleSurplus(device));
        } else {
            resolve(handleDeficit(device));
        }
    })
}

/*
    SECTION: Helper functions
*/

async function handleSurplus(device) {
    return new Promise(async (resolve, reject) => {
        let values = createArrayOfLength(60);
        values[2] = baseLoad * (3600 / ticksPerHour);
        values[3] = device.currentPower * (3600 / ticksPerHour);
        await dbG.updateGraph("powerStats", values, true);
        resolve(true);
    })
}

async function handleDeficit(device) {
    return new Promise(async (resolve, reject) => {
        let values = createArrayOfLength(60);
        values[0] = baseLoad * (3600 / ticksPerHour);
        values[1] = device.currentPower * (3600 / ticksPerHour);
        await dbG.updateGraph("powerStats", values, true);
        resolve(true);
    })
}

function createArrayOfLength(length) {
    let arr = Array(length);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = 0;
    }
    return arr;
}

async function getAvoidedPeaker() {
    return new Promise(async (resolve, reject) => {
        let statsGraph = await dbG.getGraph("powerStats");
        let basePowerUsedInDeficit = statsGraph.values[0];
        let powerUsedInDeficit = statsGraph.values[1];

        resolve(basePowerUsedInDeficit - powerUsedInDeficit);
    })
}

function getEnergyStored() {
    return new Promise(async (resolve, reject) => {
        let statsGraph = await dbG.getGraph("powerStats");
        let basePowerUsedInSurplus = statsGraph.values[2];
        let powerUsedInSurplus = statsGraph.values[3];

        resolve(powerUsedInSurplus - basePowerUsedInSurplus);
    })
}

function setBaseLoad(_baseLoad) {
    baseLoad = _baseLoad;
}
function setTicksPrHour(_ticksPerHour) {
    ticksPerHour = _ticksPerHour;
}
