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
    setTicksPerHour: (ticksPerHour) => setTicksPerHour(ticksPerHour),
}
module.exports = functions;

let updatedDevices = [];

let baseBadTicks = 0;
let powerBadTicks = 0;

let baseGoodTicks = 0;
let powerGoodPower = 0;

let ticksPerHours;

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

function getTicksSaved() {
    return baseBadTicks - powerBadTicks;
}

function getGoodPowerUsed(basePerTick) {
    return powerGoodPower - baseGoodTicks * basePerTick;
}

function setTicksPerHour(_ticksPerHour) {
    ticksPerHour = _ticksPerHour;
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

async function savePowerStats(device, surplusGraph, date) {
    let arr = [60];
    if (surplusGraph.values[date.getMinutes()] <= 0) {
        // Add bad base tick
        arr[0] += 1;

        // Add bad power tick
        if (device.currentState === "on") {
            arr[1] += 1;
        }
    } else {
        // Add good base tick
        arr[2] += 1;

        // Add bad power tick
        if (device.currentState === "on") {
            arr[3] += device.currentPower / (ticksPerHour);
        }
    }
    return new Promise(async (resolve, reject) => {
        await daG.updateGraph("powerStats", arr, true);
        resolve(true);
    })
}