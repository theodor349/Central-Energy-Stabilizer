const daD = require('./DatabaseAccessorDevice.js');
const daG = require('./DatabaseAccessorGraph.js');
const forecaster = require('./Forecaster.js');
const util = require('./Utilities.js');

const functions = {
    scheduleDevice: (device) => scheduleDevice(device),
    getCommandQueue: () => getCommandQueue(),
    clearUpdatedDevices: () => clearUpdatedDevices(),
    getUpdatedDevices: () => getUpdatedDevices(),
    getTicksSaved: () => getTicksSaved(),
    getGoodPowerUsed: (basePerTick) => getGoodPowerUsed(basePerTick),
    savePowerStatsToDatabase: () => savePowerStatsToDatabase(),
    setTicksPerHour: (_ticks) => setTicksPerHour(_ticks),
}
module.exports = functions;

let updatedDevices = [];
let powerStatsGraph;
let ticksPerHour;

function setTicksPerHour(_ticks) {
    ticksPerHour = _ticks;
}

async function scheduleDevice(device) {
    return new Promise(async (resolve, reject) => {
        let date = new Date();

        // If the device is on add demand
        if (device.currentState === "on") {
            let demandGraph = [device.currentPower];
            await forecaster.addDemand(date, demandGraph);
        }

        let graphId = util.dateToId("apiSurplusGraph", date);
        let surplusGraph = await daG.getGraph(graphId);

        // To show how much we have saved
        savePowerStats(device, surplusGraph, date);

        graphId = util.dateToId("surplusGraph", date);
        surplusGraph = await daG.getGraph(graphId);
        let schedule = {
            start: date
        }

        // If there is surplus and the device is not scheduled to "on"
        if (surplusGraph.values[date.getMinutes()] > 0 && device.nextState !== "on") {
            await daD.updateDevice(device.deviceId, "nextState", "on");
            await daD.updateDevice(device.deviceId, "isScheduled", true);
            await daD.updateDevice(device.deviceId, "schedule", schedule);

            addUpdatedDevice(device.deviceId);

            resolve(true);
        }
        // If there is no surplus and the device is not scheduled to "off"
        else if (surplusGraph.values[date.getMinutes()] <= 0 && device.nextState !== "off") {
            await daD.updateDevice(device.deviceId, "nextState", "off");
            await daD.updateDevice(device.deviceId, "isScheduled", true);
            await daD.updateDevice(device.deviceId, "schedule", schedule);

            addUpdatedDevice(device.deviceId);

            resolve(true);
        } else {
            resolve(false);
        }
    });
}

/*
    SECTION: Helper Functions
*/

async function getTicksSaved() {
    let stats = await daG.getGraph("powerStats");
    let baseBadTicks = stats.values[0];
    let powerBadTicks = stats.values[1];
    return baseBadTicks - powerBadTicks;
}

async function getGoodPowerUsed(basePerTick) {
    let stats = await daG.getGraph("powerStats");
    let baseGoodTicks = stats.values[2];
    let powerGoodPower = stats.values[3];
    return powerGoodPower - baseGoodTicks * basePerTick;
}

function addUpdatedDevice(deviceId) {
    updatedDevices.push(deviceId);
}

function getCommandQueue() {

}

function getUpdatedDevices() {
    return updatedDevices;
}

function clearUpdatedDevices() {
    updatedDevices = [];
}

async function savePowerStatsToDatabase() {
    return new Promise(async (resolve, reject) => {
        let res = false;
        if (powerStatsGraph !== undefined) {
            res = await daG.updateGraph("powerStats", powerStatsGraph, true);
        }
        createSavePowerStats();
        resolve(res);
    })
}

function createSavePowerStats() {
    powerStatsGraph = Array(60);

    for (var i = 0; i < powerStatsGraph.length; i++) {
        powerStatsGraph[i] = 0;
    }
}

function savePowerStats(device, surplusGraph, date) {
    if (powerStatsGraph === undefined) {
        createSavePowerStats();
    }

    if (surplusGraph.values[date.getMinutes()] <= 0) {
        // Add bad base tick
        powerStatsGraph[0] += 1;

        // Add bad power tick
        if (device.currentState === "on") {
            powerStatsGraph[1] += 1;
        }
    } else {
        // Add good base tick
        powerStatsGraph[2] += 1;

        // Add bad power tick
        if (device.currentState === "on") {
            powerStatsGraph[3] += device.currentPower * (3600 / ticksPerHour);
        }
    }
}