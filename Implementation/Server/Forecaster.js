/*
    Graphs it works with
        deviceDemand
        surplus
*/

const functions = {
    updateSurplus: () => updateSurplus,
    addDemand: (startTime, graph) => addDemand(startTime, graph),
    removeDemand: (startTime, graph) => removeDemand(startTime, graph),
}
module.exports = functions;

function updateSurplus () {
    let updatedGraph
}

function addDemand (startTime, graph){

    let date = new Date();
    let t = 0; 

    console.log(date);

    let startTimeMinutes = startTime.getMinutes();

    let demandGraph = [];
    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    let hours = date.getHours();
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    console.log("seconds: " + seconds);
    console.log("minutes: " + minutes);
    console.log("hours: " + hours);
    console.log("date: " + day);
    console.log("month: " + month);
    console.log("year: " + year);

    for (i = 0; i < startTimeMinutes; i++){
        demandGraph[i] = "n";
    }

    for (i = startTimeMinutes, t = 0; i < 60; i++, t++) {
        console.log(i);
        console.log(t);
        demandGraph[i] = graph[t];
    }

    for (i = t; t < 60; t++){
    }
    console.log(demandGraph);


}

function removeDemand (startTime, graph){
}

time = new Date();

testGraph = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                41, 42, 43, 44, 45, 46, 47, 38, 39, 50,
                51, 52, 53, 54, 55, 56, 57, 58, 59, 60];

addDemand(time, testGraph);
