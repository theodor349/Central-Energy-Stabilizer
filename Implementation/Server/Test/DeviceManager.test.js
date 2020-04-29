const assert = require('assert');
const dm = require('./../DeviceManager.js');
const db = require('./../DatabaseAccessorDevice.js');
const uuid = require('uuidv4');

if (true) {
    describe('Device Manager', () => {

        // On Connect
        it('onConnect: Adds command to commandQueue', async () => {
            dm.onConnect("socket");
            let commandQueue = dm.getCommandQueue();
            assert(commandQueue !== undefined &&
                commandQueue.length === 1 &&
                commandQueue[0].socket === "socket" &&
                commandQueue[0].command === 'askForId');
        })

        // Receive ID
        it('receiveId: Connection with good uuId', async () => {
            let res = dm.receiveId("3d71d761-72ea-4955-ae8c-e7700099e41a", "socket");
            let commandQueue = dm.getCommandQueue();
            assert(res === true &&
                commandQueue !== undefined &&
                commandQueue.length === 0);
        })
        it('receiveId: Connection with wrong uuId', async () => {
            let res = dm.receiveId("PLZ return false", "socket");
            let commandQueue = dm.getCommandQueue();
            assert(res === false &&
                commandQueue !== undefined &&
                commandQueue.length === 1 &&
                commandQueue[0].socket === "socket" &&
                commandQueue[0].command === 'setId' &&
                uuid.isUuid(commandQueue[0].payload));
        })
        it('receiveId: Connection without Id', async () => {
            let id;
            let res = dm.receiveId(id, "socket");
            let commandQueue = dm.getCommandQueue();
            assert(res === false &&
                commandQueue !== undefined &&
                commandQueue.length === 1 &&
                commandQueue[0].socket === "socket" &&
                commandQueue[0].command === 'setId' &&
                uuid.isUuid(commandQueue[0].payload));
        })

        // Device initTemp
    })
}