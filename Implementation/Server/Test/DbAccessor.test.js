const assert = require('assert');
const da = require('./../DatabaseAccessor.js');

function createDevicePrototype() {
    let program_0 = {
        graph: [
            1,
            5,
            10,
            10,
            20,
            20,
            10,
            5,
            1,
        ]
    };

    let program_1 = {
        graph: [
            10,
            10,
            10,
        ]
    };

    let waterHeaterPrograms = [
        program_0,
        program_1
    ];

    let waterHeaterProps = [{
            temp: 60
        },
        {
            mintemp: 55
        },
        {
            maxtemp: 80
        }
    ];

    let scheduleInterval = {
        start: new Date(0),
        end: new Date(100000)
    }
    let schedule = {
        start: new Date(100),
        end: new Date(1000)
    }

    let deviceWaterHeater_1 = {
        deviceID: "testId",
        isAutomatic: Boolean(false),
        currentPower: 132,
        currentState: "Off",
        deviceType: "Water Heater",
        isConnected: Boolean(true),
        programs: waterHeaterPrograms,
        uniqueProperties: waterHeaterProps
    };

    return deviceWaterHeater_1;
}

// Tests functions on creating entries into the database
describe('Creating database entries', () => {
    it('creates a device', async () => {
        let device = createDevicePrototype();
        let rap = await da.createDevice(device);
        assert(rap.isNew !== undefined && !rap.isNew);
    });
});

// Tests functions on reading entries from the database
//describe('Reading database entries', () => {
//    it('reads a device', (done) => {
//        device = da.getDevice(device.deviceID).then(() => {
//            assert(!device.isNew);
//            done();
//        });
//    });
//});
//
//// Tests functions on deleting devices from the database
//describe('Deleting database entries', () => {
//    it('deletes a device', (done) => {
//        da.deleteDevice(device.deviceID).then(() => {
//            assert(da.getDevice(device.deviceID) === False);
//            done();
//        });
//    });
//});
//
//// Tests functions on updating devices in database
//describe('Updating database entries', () => {
//    it('updates a device', (done) => {
//        da.updateDevice(device.deviceID, device.currentPower, 135).then(() => {
//            assert(device.currentPower === 135);
//            done();
//        });
//    });
//});