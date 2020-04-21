const assert = require('assert');
const app = require('./../App.js');

describe('Water heater stateMachine', () => {
    let testDevice = {
        state: "On",
        isConnected: false,
        serverMessage: null,
        uniqueProperties: {
            currentTemp: 91,
            minTemp: 55,
            maxTemp: 90
        }
    }

    it('device is too hot', () => {
        app.checkState(testDevice);
        assert(testDevice.state === "Off");
    })

});






/*
describe('Changing states', () => {
    it('set to off', () => {
        app.changeStateToOff();
        let info = app.getDeviceInfo();
        assert(info.state === 'Off');
    });

    it('from off to off', () => {
        app.changeStateToOff();
        app.changeStateToOff();
        let info = app.getDeviceInfo();
        assert(info.state === 'Off');
    });

    it('set to on', () => {
        app.changeStateToOn();
        let info = app.getDeviceInfo();
        assert(info.state === 'On');
    });

    it('from on to off', () => {
        app.changeStateToOn();
        app.changeStateToOff();
        let info = app.getDeviceInfo();
        assert(info.state === 'Off');
    });

    it('from off to on', () => {
        app.changeStateToOff();
        app.changeStateToOn();
        let info = app.getDeviceInfo();
        assert(info.state === 'On');
    });

    it('from on to on', () => {
        app.changeStateToOn();
        app.changeStateToOn();
        let info = app.getDeviceInfo();
        assert(info.state === 'On');
    });
}); */