const daD = require('./DatabaseAccessorDevice.js');
const daG = require('./DatabaseAccessorGraph.js');
const forecaster = require('./Forecaster.js');
const util = require('./Utilities.js');

const functions = {
    scheduleDevice: (device) => scheduleDevice(device),
    getCommandQueue: () => getCommandQueue(),
    clearUpdatedDevices: () => clearUpdatedDevices(),
    getUpdatedDevices: () => getUpdatedDevices(),
}
module.exports = functions;

let updatedDevices = [];

async function scheduleDevice(device) {
    return new Promise(async (resolve, reject) => {
        let date = new Date();

        // If the device is on add demand
        if (device.currentState === "on") {
            let demandGraph = [3000 / (60 * 60)]; // TODO: Make dynamic
            await forecaster.addDemand(date, demandGraph);
        }

        let graphId = util.dateToId("surplusGraph", date);
        let surplusGraph = await daG.getGraph(graphId);
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
        else if (device.nextState !== "off") {
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