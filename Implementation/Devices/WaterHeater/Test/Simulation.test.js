const assert = require('assert');
const app = require('./../App.js');

async function waitXMs(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, ms);
    });
}

describe('Water heater stateMachine', () => {

    it('device is too hot, not connected', async() => {
        await waitXMs(15);
        let testDevice = {
            currentState: "on",
            isConnected: false,
            serverMessage: null,
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 91,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.setState(testDevice);
        assert(testDevice.currentState === "off");
    })

    it('device is too hot, connected', () => {
        let testDevice = {
            currentState: "on",
            isConnected: true,
            serverMessage: null,
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 91,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.setState(testDevice);
        assert(testDevice.currentState === "off");
    })

    it('device is too cold, connected', () => {
        let testDevice = {
            currentState: "on",
            isConnected: true,
            serverMessage: null,
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 33,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.setState(testDevice);
        assert(testDevice.currentState === "on");
    })

    it('device is too cold, not connected', () => {
        let testDevice = {
            currentState: "on",
            isConnected: false,
            serverMessage: null,
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 33,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.setState(testDevice);
        assert(testDevice.currentState === "on");
    })

    it('device is disconnected', () => {
        let testDevice = {
            currentState: "on",
            isConnected: true,
            serverMessage: null,
            onDisconnect: true,
            uniqueProperties: {
                currentTemp: 66,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.setState(testDevice);
        assert(testDevice.currentState === "off");
    })

    it('device is hotter than min temp while not connected', () => {
        let testDevice = {
            currentState: "on",
            isConnected: false,
            serverMessage: null,
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 56,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.setState(testDevice);
        assert(testDevice.currentState === "off");
    })

    it('device is hotter than min temp while connected', () => {
        let testDevice = {
            currentState: "on",
            isConnected: true,
            serverMessage: null,
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 56,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.setState(testDevice);
        assert(testDevice.currentState === "on");
    })

    it('device recieves serverMessage on', () => {
        let testDevice = {
            currentState: "off",
            isConnected: true,
            serverMessage: "on",
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 56,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.setState(testDevice);
        assert(testDevice.currentState === "on");
    })

    it('device recieves serverMessage off', () => {
        let testDevice = {
            currentState: "on",
            isConnected: true,
            serverMessage: "off",
            onDisconnect: false,
            uniqueProperties: {
                currentTemp: 56,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.setState(testDevice);
        assert(testDevice.currentState === "off");
    })

});

describe('Water heater temperature while off/on', () => {

    it('device temperature rises when waterheater is on', async () => {

        let priorTemp = 66;

        let testDevice = {
            currentState: "on",
            isConnected: false,
            serverMessage: null,
            uniqueProperties: {
                currentTemp: priorTemp,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.setTemp(testDevice);
        assert(priorTemp < testDevice.uniqueProperties.currentTemp);

    })

    it('device temperature falls when waterheater is off', async () => {

        let priorTemp = 66;

        let testDevice = {
            currentState: "off",
            isConnected: false,
            serverMessage: null,
            uniqueProperties: {
                currentTemp: priorTemp,
                minTemp: 55,
                maxTemp: 90
            }
        }
        app.setTemp(testDevice);
        assert(priorTemp > testDevice.uniqueProperties.currentTemp);

    })
});

describe('Water heater current power usage', () => {

    it('Energy usage goes to next currentState in array from index 0', async () => {
        let testDevice = {
            currentState: "on",
            programs: [
                {
                    pointArray: [
                        0, 750, 1500, 2250, 3000, Infinity
                    ]
                }
            ],
            currentPower: 0,
            graphIndex: 0
        }
        app.setPower(testDevice);
        assert(testDevice.currentPower === 750);
    })

    it('Energy usage goes to next currentState in array from index 2', async () => {
        let testDevice = {
            currentState: "on",
            programs: [
                {
                    pointArray: [
                        0, 750, 1500, 2250, 3000, Infinity
                    ]
                }
            ],
            currentPower: 0,
            graphIndex: 2
        }

        app.setPower(testDevice);
        assert(testDevice.currentPower === 2250);
    })

    it('Energy usage does not go to infinity (stays at max)', async () => {
        let testDevice = {
            currentState: "on",
            programs: [
                {
                    pointArray: [
                        0, 750, 1500, 2250, 3000, Infinity
                    ]
                }
            ],
            currentPower: 0,
            graphIndex: 4
        }

        app.setPower(testDevice);
        assert(testDevice.currentPower === 3000 && testDevice.graphIndex === 4);
    })

    it('Current power is 0 when device is turned off', async () => {
        let testDevice = {
            currentState: "off",
            programs: [
                {
                    pointArray: [
                        0, 750, 1500, 2250, 3000, Infinity
                    ]
                }
            ],
            currentPower: 3000,
            graphIndex: 5
        }

        app.setPower(testDevice);
        assert(testDevice.graphIndex === 0 && testDevice.currentPower === 0);
    })
});
