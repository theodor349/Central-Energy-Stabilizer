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
    if (graphObject.name === "surplusGraph") {
        console.log("h: " + graphObject.hour + " num m: " + graphObject.values.length);
    }

    if (newGraphName === graphObject.name) {
        if (graphObject.values !== "done") {
            newGraph.push(graphObject.values);
        } else {
            let graphReadyToPlot = convertArray(newGraph);
            switch (graphObject.name) {
                case "apiSurplusGraph":
                    drawGraphValues(graphObject.name, graphReadyToPlot, demandGraphStyle, mainGraph);
                    break;

                case "surplusGraph":
                    drawGraphValues(graphObject.name, graphReadyToPlot, otherDemandGraphStyle, mainGraph);
                    break;

                default:

            }
        }

    } else {
        newGraphName = graphObject.name;
        newGraph = [];
        newGraph.push(graphObject.values);
    }
});

let cachedUpdateCommands = [];
socket.on('graphValueUpdate', function(graphPoint) {
    console.log("---");
    if (graphPoint.name === "surplusGraph") {
        console.log("h: " + graphPoint.hour + " m: " + graphPoint.minute);
    }
    let graphValueObject = getGraphValueObject(graphPoint.name);

    if (graphValueObject === undefined || !graphValueObject.isDone) {
        cachedUpdateCommands.push(graphPoint);
    } else {
        // Cached Commands
        while (cachedUpdateCommands.length > 0) {
            executeUpdatePoint(graphValueObject, cachedUpdateCommands.pop());
        }
        // New Command
        executeUpdatePoint(graphValueObject, graphPoint);
    }
});

function executeUpdatePoint(graphValueObject, graphPoint) {
    if ((graphValueObject.graphPointer + 1) % graphValueObject.valuesToSkip == 0) {
        updateGraphValues(graphPoint, graphValueObject);
    } else {
        graphValueObject.graphPointer += 1;
    }
}


socket.on('removeDevice', function(device) {
    removeDevice(device);
});