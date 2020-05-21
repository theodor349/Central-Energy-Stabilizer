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
    if (frontEndSavedKWh === 0) {
        frontEndSavedKWhContainer.innerHTML = amount;
        frontEndSavedKWh = amount;
    } else if (frontEndSavedKWh < amount) {

        setTimeout(function() {
            frontEndSavedKWh = Number(Number(frontEndSavedKWh) + 0.0001).toFixed(4);
            frontEndSavedKWhContainer.innerHTML = frontEndSavedKWh;
            updateSavedKwhData(amount);
        }, 100);
    }


}

let frontEndUsedKWh = 0;
let frontEndUsedKWhContainer = document.getElementById('usedKwhContainer');

function updateUsedKwhData(amount) {

    if (frontEndUsedKWh === 0) {
        frontEndUsedKWhContainer.innerHTML = amount;
        frontEndUsedKWh = amount;
    } else if (frontEndUsedKWh < amount) {

        setTimeout(function() {
            frontEndUsedKWh = Number(Number(frontEndUsedKWh) + 0.0001).toFixed(4);
            frontEndUsedKWhContainer.innerHTML = frontEndUsedKWh;
            updateUsedKwhData(amount);
        }, 100);
    }


}