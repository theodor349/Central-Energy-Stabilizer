let socket = io('/user');

let knownDevices = [];

let connectionText = document.getElementById('connectionLost');

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
        console.log("h: " + graphObject.hour + " length: " + graphObject.values.length);
    }
    // if the graph has already been drawn return
    if (getGraphValueObject(graphObject.name) !== undefined) {
        return;
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
    if (graphValueObject.name === "surplusGraph") {
        console.log("---");
        console.log("h: " + graphPoint.hour + " m: " + graphPoint.minute);
        console.log("y: " + graphPoint.values[0]);
        console.log("Graph pointer: " + graphValueObject.graphPointer);
    }

    if ((graphValueObject.graphPointer - 1) % graphValueObject.valuesToSkip == 0) {
        console.log("Plotting");
        updateGraphValues(graphPoint, graphValueObject);
    } else {
        console.log("Not Plotting");
        graphValueObject.graphPointer += 1;
    }
}

socket.on('connect', function() {
    drawGraph(mainGraph);
    connectionText.style.display = "none";
});

socket.on('disconnect', function() {
    deleteActiveGraphs();
    connectionText.style.display = "block";
});


socket.on('removeDevice', function(device) {
    removeDevice(device);
});

socket.on('savedKwhData', function(amount) {
    updateSavedKwhData(amount);
});

socket.on('usedKwhData', function(amount) {
    updateUsedKwhData(amount);
});

let frontEndSavedKWh = 0;
let frontEndSavedKWhContainer = document.getElementById('savedKwhContainer');

function updateSavedKwhData(amount) {
    let diff = Math.abs(amount) - Math.abs(frontEndSavedKWh);
    if (frontEndSavedKWh === 0) {
        frontEndSavedKWhContainer.innerHTML = amount;
        frontEndSavedKWh = amount;
    } else if (Math.abs(diff) > 0.0001) {
        setTimeout(function() {
            let scale = (diff > 0) ? -1 : 1;
            frontEndSavedKWh = Number(Number(frontEndSavedKWh) + (0.0001 * scale)).toFixed(4);
            frontEndSavedKWhContainer.innerHTML = frontEndSavedKWh;
            updateSavedKwhData(amount);
        }, 100);
    }
}

let frontEndUsedKWh = 0;
let frontEndUsedKWhContainer = document.getElementById('usedKwhContainer');

function updateUsedKwhData(amount) {
    let diff = Math.abs(amount) - Math.abs(frontEndUsedKWh);
    if (frontEndUsedKWh === 0) {
        frontEndUsedKWhContainer.innerHTML = amount;
        frontEndUsedKWh = amount;
    } else if (Math.abs(diff) > 0.0001) {
        setTimeout(function() {
            let scale = (diff > 0) ? -1 : 1;
            frontEndUsedKWh = Number(Number(frontEndUsedKWh) + (0.0001 * scale)).toFixed(4);
            frontEndUsedKWhContainer.innerHTML = frontEndUsedKWh;
            updateUsedKwhData(amount);
        }, 100);
    }
}
