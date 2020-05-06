const assert = require('assert');
const dm = require('./../DeviceManager.js');
const db = require('./../DatabaseAccessorDevice.js');
const um = require('./../UserManager.js');
const uuid = require('uuidv4');

if (false) {
    describe('User Manager', () => {

        // On Connect
        it('onConnect: 0 devices', async () => {
            let activeConnections = [];
            let commandQueue = [];
            um.onConnect("socket", activeConnections);

            assert(commandQueue.length === 0 &&
                activeConnections.length === 0);
        })
        it('onConnect: 1 device', async () => {
            let activeConnections = [];
            let commandQueue = [];
            um.onConnect("socket", activeConnections);

            assert(commandQueue.length === 1 &&
                activeConnections.length === 1);
        })
        it('onConnect: 2 devices', async () => {
            let activeConnections = [];
            let commandQueue = [];
            um.onConnect("socket", activeConnections);

            assert(commandQueue.length === 2 &&
                activeConnections.length === 2);
        })
    })
}
