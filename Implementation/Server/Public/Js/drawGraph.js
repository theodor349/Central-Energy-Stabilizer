'use strict';

const svgNS = "http://www.w3.org/2000/svg";
const horizontalTextOffset = 4; // how far ahead should the text be taken to be aligned center with line


/*
    SECTION: graph definitions
*/

let mainGraphElement = document.getElementById("mainGraph");
let mainGraph = {
    htmlElement: mainGraphElement,
    height: "450", //px
    width: null, //pw
    horizotalTextheight: 15, //px
    verticalTextWidth: 40, //px
    innerHeight: null,
    innerWidth: null,
    horizontalLines: 20,
    horizontalValue: "watt",
    verticalLines: 48,
    verticalValue: "time interval 24 hours",
    lowerLimit: 1000,
    verticalTextOffset: 18, // how far back should the text be taken to be aligned center with line
    indexDeviderIntervalHorizontal: 5,
    indexDeviderIntervalVertical: 3
};


/*
    SECTION: testing
*/

drawGraph(mainGraph);

function drawGraph(graph) {
    getGraphSize(graph);
    drawGraphBackground(graph);
    drawGraphHorizontalLines(graph);
    drawGraphVerticalLines(graph);
}



/*
--------------------------------------------------------------------------------
END OF DEFINITIONS
________________________________________________________________________________
*/

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

    if (!(graph.verticalValue.includes("time interval"))) {
        value.textContent = graph.verticalValue;
    }

    // is not currently dymanic
    else {

        if (lineOffset / 2 < 10) {
            value.textContent = "0" + lineOffset / 2;

        } else {
            value.textContent = lineOffset / 2;
        }

        if (graph.innerWidth > graph.lowerLimit) {
            value.textContent += ":00";
            value.setAttributeNS(null, "x", graph.verticalTextWidth + offsetValue - graph.verticalTextOffset + "px");
        } else {
            value.setAttributeNS(null, "x", graph.verticalTextWidth + offsetValue - (graph.verticalTextOffset / 2) + "px");

        }
    }

    graph.htmlElement.appendChild(value);
}

function drawGraphHorizontalLines(graph) {
    for (let lineOffset = 1; lineOffset < graph.horizontalLines; lineOffset++) {
        let line = document.createElementNS(svgNS, "line");
        let offsetValue = lineOffset * graph.height / graph.horizontalLines;
        line.setAttributeNS(null, "x1", graph.innerWidth + graph.verticalTextWidth + "px");
        line.setAttributeNS(null, "x2", graph.verticalTextWidth + "px");


        line.setAttributeNS(null, "y1", graph.innerHeight - offsetValue + "px");
        line.setAttributeNS(null, "y2", graph.innerHeight - offsetValue + "px");
        line.setAttributeNS(null, "class", "graphBgLine");

        if (lineOffset % (graph.indexDeviderIntervalHorizontal + 1) === 0) {
            drawGraphHorizontalTextPoint(line, graph, lineOffset, offsetValue);

        } else {
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

    if (!(graph.horizontalValue.includes("time interval"))) {
        value.textContent = graph.horizontalValue;
    }
    graph.htmlElement.appendChild(value);

}