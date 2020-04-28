const assert = require('assert');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const waterHeater = require('./../App.js');
waterHeater.changeConnectionString("http://localhost:3001/device")

async function waitXMs(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, ms);
    });
}

http.listen(3001, function() {
});

let isConnected = false;
let newDevice = null;
let updatedDevice = null;
let deviceSocket;

const deviceSpace = io.of('/device');
deviceSpace.on('connection', function(socket) {
    isConnected = true;
    deviceSocket = socket;
    socket.emit('askForId');
    socket.on('receiveDeviceId', function(Id) {
    });

    socket.on('newDeviceWithId', function(device) {
        newDevice = device;
    });

    socket.on('stateChanged', function(state, Id) {
    });

    socket.on('deviceUpdate', function(device){
        updatedDevice = device;
    });
});

/*
Connects to port 3001
Correctly sets id
Correctly updates device
 */

 describe('Water Heater Connection', () => {

     it('Connects to port 3001', async() => {
         await waitXMs(50);
         assert(isConnected === true);
     })

     it('Correctly sets id', async() => {
         newDevice = null;
         deviceSocket.emit('setId', "testId")
         await waitXMs(5);
         assert(newDevice.deviceId === "testId");
     })

     it('Correctly updates device', async() => {
         updatedDevice = null;
         let testDevice = {
             state: "off",
             isConnected: true,
             serverMessage: null,
             onDisconnect: false,
             uniqueProperties: {
                 currentTemp: 91,
                 minTemp: 55,
                 maxTemp: 90
             }
         }
         waterHeater.sendUpdate(testDevice);
         await waitXMs(5);
         assert(updatedDevice.state === "off" &&
            updatedDevice.uniqueProperties.currentTemp === 91);
     })
})
