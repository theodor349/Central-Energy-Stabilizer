const da = require('./DatabaseAccessorDevice.js');
const rqstMngr = require('./RequestManager.js');

const functions = {
    scheduleDevice: (device) => scheduleDevice(device),
}

module.exports = functions;

function scheduleDevice (device) {
    /*
    return new Promise(async (resolve, reject) => {
        // Retrieves interval and demand graph for device
        deviceIntervalObject = {
            start: new Date(),
            end: new Date()
        }

        deviceIntervalObject.start = device.scheduledInterval.start;
        deviceIntervalObject.end = device.scheduledInterval.end;
        demandGraph = device.programs[0].pointArray;

        let newSchedule = await rqstMngr.requestTimeToRun(demandGraph, deviceIntervalObject);

        // Updates schedule for the device in the database
        da.updateDevice(device, "schedule", newSchedule);

        // Add device to Updated devices list

        resolve(true);
    });
*/
}



function commandQueue() {

}

function updatedDevices() {

}

function removeSchedule (deviceId) {

}

