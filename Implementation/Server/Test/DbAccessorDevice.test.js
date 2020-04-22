const assert = require('assert');
const da = require('./../DatabaseAccessorDevice.js');

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
describe('Creating database devices', () => {
    it('creates a device correct', async () => {
        da.dropDatabase();
        let device = createDevicePrototype();
        let res = await da.createDevice(device);
        assert(res.isNew !== undefined && !res.isNew);
    });

    it('creates a device with wrong input', async () => {
        da.dropDatabase();
        let device = createDevicePrototype();
        device.isAutomatic = "PLZ return an Error";
        let res = await da.createDevice(device);
        assert(err.name === 'ValidationError');
    });
});

describe('Get database devices', () => {
    it('get a device correct', async () => {
        da.dropDatabase();
        let device = createDevicePrototype();
        await da.createDevice(device);

        let res = await da.getDevice("testId");
        assert(res !== null && res.deviceID === device.deviceID);
    });

    it('get a device wrong ID', async () => {
        da.dropDatabase();
        let device = createDevicePrototype();
        await da.createDevice(device);

        let res = await da.getDevice("PLZ return an Error");
        assert(res === null);
    });
});

describe('Deleting database devices', () => {
    it('delete a device correct', async () => {
        da.dropDatabase();
        let device = createDevicePrototype();
        await da.createDevice(device);
        let res = await da.deleteDevice(device.deviceID);
        let resD = await da.getDevice(device.deviceID);
        assert(res === true && resD === null);
    });

    it('delete a device wrong ID', async () => {
        da.dropDatabase();
        let device = createDevicePrototype();
        await da.createDevice(device);
        await da.deleteDevice(device.deviceID);

        let res = await da.deleteDevice(device.deviceID);
        let resD = await da.getDevice(device.deviceID);

        assert(res === true && resD !== undefined);
    });
});

describe('Update database devices', () => {
    it('update state of device correct', async () => {
        da.dropDatabase();
        let device = createDevicePrototype();
        await da.createDevice(device);
        let res = await da.updateDevice(device.deviceID, "currentState", "On");
        let resD = await da.getDevice(device.deviceID);

        console.log("res: " + res);
        console.log(resD);
        assert(res === true && resD !== undefined && resD.currentState === "On");
    });

    it('update uniqueProperties of device correct', async () => {
        da.dropDatabase();
        let device = createDevicePrototype();
        await da.createDevice(device);

        let props = device.uniqueProperties;
        props.mintemp = 10;

        let res = await da.updateDevice(device.deviceID, "uniqueProperties", props);
        let resD = await da.getDevice(device.deviceID);

        assert(res === true && resD !== undefined && resD.uniqueProperties.mintemp === 10);
    });
});
