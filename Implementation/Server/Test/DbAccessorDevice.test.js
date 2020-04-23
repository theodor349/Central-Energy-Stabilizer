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

    let waterHeaterProps = {
        temp: 60,
        mintemp: 55,
        maxtemp: 80
    }

    let scheduleInterval = {
        start: new Date(0),
        end: new Date(100000)
    }
    let schedule = {
        start: new Date(100),
        end: new Date(1000)
    }

    let deviceWaterHeater_1 = {
        deviceId: "testId",
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

if (true) {
    // Tests functions on creating entries into the database
    describe('DatabaseAccessor Device', () => {
        it('create: device correct with correct input', async () => {
            da.dropDatabase();
            let device = createDevicePrototype();
            let res = await da.createDevice(device);
            assert(res.isNew !== undefined && !res.isNew);
        });

        it('get: device correct with correct ID', async () => {
            da.dropDatabase();
            let device = createDevicePrototype();
            await da.createDevice(device);

            let res = await da.getDevice("testId");
            assert(res !== null && res.deviceId === device.deviceId);
        });

        it('get: device wrong with ID', async () => {
                da.dropDatabase();
            let device = createDevicePrototype();
            await da.createDevice(device);
    
            let res = await da.getDevice("PLZ return an Error");
            assert(res === null);
        });
        it('delete: device with correct ID', async () => {
            da.dropDatabase();
            let device = createDevicePrototype();
            await da.createDevice(device);
            let res = await da.deleteDevice(device.deviceId);
            let resD = await da.getDevice(device.deviceId);
            assert(res === true && resD === null);
        });
    
        it('delete: device with wrong ID', async () => {
            da.dropDatabase();
            let device = createDevicePrototype();
            await da.createDevice(device);
            await da.deleteDevice(device.deviceId);
    
            let res = await da.deleteDevice(device.deviceId);
            let resD = await da.getDevice(device.deviceId);
    
            assert(res === true && resD !== undefined);
        });
        it('update:  device with correct state', async () => {
            da.dropDatabase();
            let device = createDevicePrototype();
            await da.createDevice(device);
            let res = await da.updateDevice(device.deviceId, "currentState", "On");
    
            let resD = await da.getDevice(device.deviceId);
            assert(res === true && resD !== undefined && resD.currentState === "On");
        });

        it('update: device with correct uniqueProperties', async () => {
            da.dropDatabase();
            let device = createDevicePrototype();
            await da.createDevice(device);

            let props = JSON.parse(device.uniqueProperties);
            props.mintemp = 10;
            let res = await da.updateDevice(device.deviceId, "uniqueProperties", props);
            let resD = await da.getDevice(device.deviceId);

            assert(res === true && resD !== undefined && resD.uniqueProperties.mintemp === 10);
        });
    });
}
