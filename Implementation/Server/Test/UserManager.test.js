const assert = require('assert');
const dm = require('./../DeviceManager.js');
const db = require('./../DatabaseAccessorDevice.js');
const um = require('./../UserManager.js');
const uuid = require('uuidv4');

if (false) {
    describe('User Manager', () => {

        // On Connect
        it('onConnect: 0 devices', async () => {
            um.onConnect("socket");
            activeConnections = getActiveConnections();
            assert(activeConnections.length === 0
                );
        })
        it('onConnect: 1 device', async () => {
            um.onConnect();
            assert();
        })
        it('onConnect: 2 devices', async () => {
            um.onConnect();
            assert();
        })
    })
}
