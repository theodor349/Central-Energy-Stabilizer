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
        app.waterHeaterOn(testDevice);
        await waitOneTick();
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
        app.waterHeaterOff(testDevice);
        await waitOneTick();
        assert(priorTemp > testDevice.uniqueProperties.currentTemp);

    })




});

async function waitOneTick() {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            resolve();
        }, 1);
    });

}