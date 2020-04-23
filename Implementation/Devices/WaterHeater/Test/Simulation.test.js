const assert = require('assert');
const app = require('./../App.js');

describe('Water heater stateMachine', () => {

    it('device is too hot, not connected', () => {
        let testDevice = {
            state: "On",
            isConnected: false,
            serverMessage: null,
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 91,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.checkState(testDevice);
        assert(testDevice.state === "Off");
    })

    it('device is too hot, connected', () => {
        let testDevice = {
            state: "On",
            isConnected: true,
            serverMessage: null,
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 91,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.checkState(testDevice);
        assert(testDevice.state === "Off");
    })

    it('device is too cold, connected', () => {
        let testDevice = {
            state: "On",
            isConnected: true,
            serverMessage: null,
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 33,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.checkState(testDevice);
        assert(testDevice.state === "On");
    })

    it('device is too cold, not connected', () => {
        let testDevice = {
            state: "On",
            isConnected: false,
            serverMessage: null,
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 33,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.checkState(testDevice);
        assert(testDevice.state === "On");
    })

    it('device is disconnected', () => {
        let testDevice = {
            state: "On",
            isConnected: true,
            serverMessage: null,
            onDisconnect: true,
            uniqueProperties: {
                currentTemp: 66,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.checkState(testDevice);
        assert(testDevice.state === "Off");
    })

    it('device is hotter than min temp while not connected', () => {
        let testDevice = {
            state: "On",
            isConnected: false,
            serverMessage: null,
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 56,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.checkState(testDevice);
        assert(testDevice.state === "Off");
    })

    it('device is hotter than min temp while connected', () => {
        let testDevice = {
            state: "On",
            isConnected: true,
            serverMessage: null,
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 56,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.checkState(testDevice);
        assert(testDevice.state === "On");
    })

    it('device recieves serverMessage On', () => {
        let testDevice = {
            state: "On",
            isConnected: true,
            serverMessage: "On",
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 56,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.checkState(testDevice);
        assert(testDevice.state === "On");
    })

    it('device recieves serverMessage Off', () => {
        let testDevice = {
            state: "On",
            isConnected: true,
            serverMessage: "Off",
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 56,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.checkState(testDevice);
        assert(testDevice.state === "Off");
    })

});

describe('Water heater temperature while off/on', () => {

    it('device temperature rises when waterheater is on', async () => {

        let priorTemp = 66;

        let testDevice = {
            state: "On",
            isConnected: false,
            serverMessage: null,
            uniqueProperties: {
                currentTemp: priorTemp,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.setWaterHeaterOn(testDevice);
        assert(priorTemp < testDevice.uniqueProperties.currentTemp);

    })

    it('device temperature falls when waterheater is off', async () => {

        let priorTemp = 66;

        let testDevice = {
            state: "Off",
            isConnected: false,
            serverMessage: null,
            uniqueProperties: {
                currentTemp: priorTemp,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.setWaterHeaterOff(testDevice);
        assert(priorTemp > testDevice.uniqueProperties.currentTemp);

    })
});

describe('Water heater current power usage', () => {

    it('Energy usage goes to next state in array', async () => {
        let testDevice = {
            programs: [
                {
                    pointArray: [
                        0, 750, 1500, 2250, 3000, Infinity
                    ]
                }
            ],
            uniqueProperties: {
                currentPower: 0
            },
            graphIndex: 0
        }

        app.setEnergyUsage(testDevice);
        assert(testDevice.uniqueProperties.currentPower === 750);

    })
});
