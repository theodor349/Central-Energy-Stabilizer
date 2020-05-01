'use strict';

const svgNS = "http://www.w3.org/2000/svg";



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
    horizontalLines: 75,
    horizontalValue: "time interval 24 hours",
    verticalLines: 25,
    verticalValue: "watt",
    indexDeviderIntervalHorizontal: 5,
    indexDeviderIntervalVertical: 4
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
    graph.innerWidth = graph.htmlElement.clientWidth - graph.verticalTextWidth;
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
    for (let lineOffset = 0; lineOffset < graph.horizontalLines; lineOffset++) {
        let offsetValue = lineOffset * graph.width / graph.horizontalLines;
        let line = document.createElementNS(svgNS, "line");
        line.setAttributeNS(null, "x1", graph.innerWidth - offsetValue + "px");
        line.setAttributeNS(null, "x2", graph.innerWidth - offsetValue + "px");
        line.setAttributeNS(null, "y1", graph.height + "px");
        line.setAttributeNS(null, "y2", 0);

        if (lineOffset % graph.indexDeviderIntervalHorizontal === 0) {
            line.setAttributeNS(null, "class", "graphBgLineDevider");

            let value = document.createElementNS(svgNS, "text");
            value.setAttributeNS(null, "class", "graphAxisValue");
            value.setAttributeNS(null, "x", graph.width - offsetValue + "vw");
            value.setAttributeNS(null, "y", graph.height + "px");

            if (!(graph.verticalValue.includes("time interval"))) {
                value.textContent = graph.verticalValue;
            }
            graph.htmlElement.appendChild(value);

        } else {
            line.setAttributeNS(null, "class", "graphBgLine");
        }

        graph.htmlElement.appendChild(line);
    }

}

function drawGraphHorizontalLines(graph) {
    for (let lineOffset = 0; lineOffset < graph.verticalLines; lineOffset++) {
        let line = document.createElementNS(svgNS, "line");
        let offsetValue = lineOffset * graph.height / graph.verticalLines;
        line.setAttributeNS(null, "x1", 100 + "%");

        line.setAttributeNS(null, "y1", graph.innerHeight - offsetValue + "px");
        line.setAttributeNS(null, "y2", graph.innerHeight - offsetValue + "px");
        line.setAttributeNS(null, "class", "graphBgLine");

        if (lineOffset % graph.indexDeviderIntervalVertical === 0) {
            line.setAttributeNS(null, "class", "graphBgLineDevider");
            line.setAttributeNS(null, "x2", 0);

            let value = document.createElementNS(svgNS, "text");
            value.setAttributeNS(null, "class", "graphAxisValue");
            value.setAttributeNS(null, "x", 0);
            value.setAttributeNS(null, "y", graph.innerHeight - offsetValue + "px");

            if (!(graph.verticalValue.includes("time interval"))) {
                value.textContent = graph.verticalValue;
            }
            graph.htmlElement.appendChild(value);

        } else {
            line.setAttributeNS(null, "class", "graphBgLine");
            line.setAttributeNS(null, "x2", graph.verticalTextWidth + "px");
        }

        graph.htmlElement.appendChild(line);
    }
}