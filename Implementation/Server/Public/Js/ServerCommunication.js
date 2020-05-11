let socket = io('/user');

let knownDevices = [];

socket.on('updateDevice', function(device) {
    if (knownDevices.includes(device.deviceId)) {
        updateDevice(device);
    } else {
        knownDevices.push(device.deviceId);
        addDevice(device);
    }
});


let newGraph = [];
let newGraphName = "";

socket.on('createGraphValues', function(graphObject) {
    if (newGraphName === graphObject.name) {

        if (graphObject.values !== "done") {
            newGraph.push(graphObject.values);
        } else {
            let graphReadyToPlot = convertArray(newGraph);

            switch (graphObject.name) {
                case "apiSurplusGraph":
                    drawGraphValues(graphReadyToPlot, demandGraphStyle, mainGraph);
                    break;

                default:

            }

        }

    } else {
        newGraphName = graphObject.name;
        newGraph = [];
        newGraph.push(graphObject.values);
    }
})


socket.on('removeDevice', function(device) {
    removeDevice(device);
});