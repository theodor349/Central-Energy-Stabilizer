const assert = require('assert');
const dm = require('./../DeviceManager.js');
const db = require('./../DatabaseAccessorDevice.js');

describe('Device Manager', () => {

    it('onConnect: Adds command to commandQueue', async() => {
        dm.onConnect("socket");
        let commandQueue = dm.getCommandQueue();
        assert(commandQueue !== undefined &&
            commandQueue.length === 1 &&
            commandQueue[0].command === 'askForId');
    })
})
