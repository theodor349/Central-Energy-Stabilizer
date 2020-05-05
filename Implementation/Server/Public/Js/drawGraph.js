'use strict';

const svgNS = "http://www.w3.org/2000/svg";
const horizontalTextOffset = 4; // how far ahead should the text be taken to be aligned center with line


let activeGraphs = [];

/*
    SECTION: graph definitions
*/

let mainGraph = {
    htmlElement: null,
    svgWidth: "95vw",
    svgHeight: "450px",
    svgId: "mainGraph",
    height: "450", //px
    width: null, //pw
    horizotalTextheight: 22, //px
    verticalTextWidth: 55, //px
    innerHeight: null,
    innerWidth: null,
    horizontalLines: 20,
    horizontalValue: "Kw",
    horizontalOrigin: 7,
    horizontalAmount: 14,
    verticalLines: 48,
    verticalValue: "time interval",
    verticalAmount: 24,
    lowerLimit: 1000,
    verticalTextOffset: 20, // how far back should the text be taken to be aligned center with line
    indexDeviderIntervalHorizontal: 4,
    indexDeviderIntervalVertical: 3
};

let demandGraphStyle = {
    steps: 24,
    style: "graphPathRed"
}


/*
    SECTION: testing
*/

function create24HProductionGraph(date) {
    let day = new Array(24);
    let d = date.getDate();
    for (var h = 0; h < 24; h++) {
        let values = new Array(60);
        for (var m = 0; m < 60; m++) {
            values[m] = getProdutionAt(d * 24 + h + m / 60);
        }
        day[h] = values;
    }
    return day;
}

function create24HDemandGraph(date) {
    let day = new Array(24);
    let d = date.getDate();
    for (var h = 0; h < 24; h++) {
        let values = new Array(60);
        for (var m = 0; m < 60; m++) {
            values[m] = getDemandAt(d * 24 + h + m / 60);
        }
        day[h] = values;
    }
    return day;
}

const scale = 1000;
const lift = 100;

function getDemandAt(x) {
    return (Math.sin(0.9 * x - 5) * 2.2 +
        Math.sin(1.4 * x - 0.2) * 1.3 +
        Math.sin(2.1 * x - 2) * 2.8 + lift) * scale;
}

function getProdutionAt(x) {
    return (Math.sin(2.7 * x + 3.3) * 0.8 +
        Math.sin((-0.5) * x + 1) * 2.7 +
        Math.sin(Math.sin(2.1 * x - 2) * 2.8) + lift) * scale;
}

function create24HSurplusGraph() {
    let newGraphProduction = create24HProductionGraph(new Date);
    let newGraphDemand = create24HDemandGraph(new Date);

    for (var h = 0; h < 24; h++) {
        let array = [];
        for (var m = 0; m < 60; m++) {
            array[m] = newGraphProduction[h][m] - newGraphDemand[h][m];
        }
        surplusGraph[h] = array;
    }
}

let firstTestGraphValues = [];
let surplusGraph = [];








twentyFourHoursLetsGo(12);

function twentyFourHoursLetsGo(hoursToGenerate) {
    for (var i = 0; i < hoursToGenerate; i++) {
        firstTestGraphValues.push([100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
            1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000,
            2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000,
            3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000,
            4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000,
            5100, 5200, 5300, 5400, 5500, 5600, 5700, 5800, 5900, 5000
        ]);
    }
}



drawGraph(mainGraph);
//drawGraphValues(firstTestGraphValues, demandGraphStyle, mainGraph);

create24HSurplusGraph();
drawGraphValues(surplusGraph, demandGraphStyle, mainGraph);

function drawGraph(graph) {

    drawSvgContainer(graph);
    getGraphSize(graph);
    drawGraphBackground(graph);
    drawGraphHorizontalLines(graph);
    drawGraphVerticalLines(graph);
    activeGraphs.push(graph.htmlElement);
}





/*
--------------------------------------------------------------------------------
END OF DEFINITIONS
________________________________________________________________________________
*/


function deleteActiveGraphs() {

    activeGraphs.forEach((graph) => {
        graph.parentNode.removeChild(graph);
    });
    activeGraphs = [];
}

function drawSvgContainer(graph) {

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS(null, "width", graph.svgWidth);
    svg.setAttributeNS(null, "height", graph.svgHeight);
    svg.setAttributeNS(null, "id", graph.svgId);
    svg.setAttributeNS(null, "overflow", "visible");



    if (graph.svgId == "mainGraph") {
        document.getElementById("mainGraphContainer").appendChild(svg);
    }

    graph.htmlElement = svg;

}

/*
    SECTION: draw graphs in SVG
*/




function getGraphSize(graph) {
    graph.width = graph.htmlElement.clientWidth;
    graph.innerWidth = graph.width - graph.verticalTextWidth;
    graph.innerHeight = graph.htmlElement.clientHeight - graph.horizotalTextheight;
}

function drawGraphBackground(graph) {
    let background = document.createElementNS(svgNS, "rect");
    background.setAttributeNS(null, "x", graph.verticalTextWidth + "px");
    background.setAttributeNS(null, "y", 0);
    background.setAttributeNS(null, "width", graph.innerWidth + "px");
    background.setAttributeNS(null, "height", graph.innerHeight + "px");
    background.setAttributeNS(null, "class", "graphBackground");

    graph.htmlElement.appendChild(background);
}

function drawGraphVerticalLines(graph) {
    for (let lineOffset = 1; lineOffset <= graph.verticalLines; lineOffset++) {
        let offsetValue = lineOffset * graph.innerWidth / graph.verticalLines;

        let line = document.createElementNS(svgNS, "line");
        line.setAttributeNS(null, "x1", graph.verticalTextWidth + offsetValue + "px");
        line.setAttributeNS(null, "x2", graph.verticalTextWidth + offsetValue + "px");
        line.setAttributeNS(null, "y1", graph.innerHeight + "px");
        line.setAttributeNS(null, "y2", 0);

        if (lineOffset % (graph.indexDeviderIntervalVertical + 1) === 0) {
            drawGraphVerticalTextPoint(line, graph, lineOffset, offsetValue);

        } else {
            if (lineOffset === 1) {
                drawGraphVerticalTextPoint(line, graph, 0, 0);
            }
            line.setAttributeNS(null, "class", "graphBgLine");
        }
        graph.htmlElement.appendChild(line);
    }
}

function drawGraphVerticalTextPoint(line, graph, lineOffset, offsetValue) {
    line.setAttributeNS(null, "class", "graphBgLineDevider");

    let value = document.createElementNS(svgNS, "text");
    value.setAttributeNS(null, "class", "graphAxisValue");

    value.setAttributeNS(null, "y", graph.height + "px");

    if (graph.verticalValue != "time interval") {
        value.textContent = graph.verticalValue;
    } else {

        let verticalRelation = graph.verticalLines / graph.verticalAmount;

        if (lineOffset / verticalRelation < 10) {
            value.textContent = "0" + lineOffset / verticalRelation;

        } else {
            value.textContent = lineOffset / verticalRelation;
        }

        if (graph.innerWidth > graph.lowerLimit) {
            value.textContent += ":00";
            value.setAttributeNS(null, "x", graph.verticalTextWidth + offsetValue - graph.verticalTextOffset + "px");
        } else {
            value.setAttributeNS(null, "x", graph.verticalTextWidth + offsetValue - (graph.verticalTextOffset / verticalRelation) + "px");
        }
    }
    graph.htmlElement.appendChild(value);
}

function drawGraphHorizontalLines(graph) {
    for (let lineOffset = 1; lineOffset <= graph.horizontalLines; lineOffset++) {
        let line = document.createElementNS(svgNS, "line");
        let offsetValue = lineOffset * graph.innerHeight / graph.horizontalLines;
        line.setAttributeNS(null, "x1", graph.innerWidth + graph.verticalTextWidth + "px");
        line.setAttributeNS(null, "x2", graph.verticalTextWidth + "px");


        line.setAttributeNS(null, "y1", graph.innerHeight - offsetValue + "px");
        line.setAttributeNS(null, "y2", graph.innerHeight - offsetValue + "px");
        line.setAttributeNS(null, "class", "graphBgLine");

        if (lineOffset % (graph.indexDeviderIntervalHorizontal + 1) === 0) {
            drawGraphHorizontalTextPoint(line, graph, lineOffset, offsetValue);

        } else {
            if (lineOffset === 1) {
                drawGraphHorizontalTextPoint(line, graph, 0, 0);
            }
            line.setAttributeNS(null, "class", "graphBgLine");
        }
        graph.htmlElement.appendChild(line);
    }
}

function drawGraphHorizontalTextPoint(line, graph, lineOffset, offsetValue) {
    line.setAttributeNS(null, "class", "graphBgLineDevider");

    let value = document.createElementNS(svgNS, "text");
    value.setAttributeNS(null, "class", "graphAxisValue");
    value.setAttributeNS(null, "x", 0);
    value.setAttributeNS(null, "y", graph.innerHeight - offsetValue + horizontalTextOffset + "px");

    if (graph.horizontalValue != "time interval") {
        let verticalRelation = graph.horizontalLines / graph.horizontalAmount;
        value.textContent = (lineOffset / verticalRelation) - graph.horizontalOrigin + graph.horizontalValue;
    }

    graph.htmlElement.appendChild(value);
}

function drawGraphValues(graphValues, style, graph) {
    let previousHorizontalValue = graph.verticalTextWidth;

    let verticalOrigin = graph.innerHeight / (graph.horizontalAmount / (graph.horizontalAmount - graph.horizontalOrigin));

    let previousVerticalValue = verticalOrigin;
    let pathWidth = graph.innerWidth / graph.verticalAmount / 60;
    let previousPath = "M" + previousHorizontalValue + " " + previousVerticalValue;

    let path = document.createElementNS(svgNS, "path");
    path.setAttributeNS(null, "class", style.style)


    graphValues.forEach((hourArray) => {

        hourArray.forEach((point) => {

            let pointValue = point / 1000 * (graph.innerHeight / graph.horizontalAmount);
            let newVerticalValue = verticalOrigin - pointValue;
            let newHorizontalValue = previousHorizontalValue += pathWidth;

            previousPath += " L" + newHorizontalValue + " " + newVerticalValue;

            path.setAttributeNS(null, "d", previousPath);

            previousVerticalValue = newVerticalValue;
            previousHorizontalValue = newHorizontalValue;

            graph.htmlElement.appendChild(path);
            return;
        });


    });

    let newVerticalValue = verticalOrigin;
    let newHorizontalValue = previousHorizontalValue;

    previousPath += " L" + newHorizontalValue + " " + newVerticalValue + " Z";

    path.setAttributeNS(null, "d", previousPath);
    path.setAttributeNS(null, "class", style.style + " graphFill")

    graph.htmlElement.appendChild(path)
}