'use strict';

const svgNS = "http://www.w3.org/2000/svg";


/*
    SECTION: graph definitions
*/

let mainGraphElement = document.getElementById("mainGraph");
let mainGraph = {
    htmlElement: mainGraphElement,
    height: "450", //px
    width: "100", //vw
    horizontalLines: 75,
    verticalLines: 25,
    indexDeviderIntervalHorizontal: 5,
    indexDeviderIntervalVertical: 4
};


/*
    SECTION: testing
*/


console.log(mainGraph);
drawGraphLines(mainGraph);



/*
--------------------------------------------------------------------------------
END OF DEFINITIONS
________________________________________________________________________________
*/

/*
    SECTION: draw graphs in SVG
*/

function drawGraphLines(graph) {

    for (let lineOffset = 0; lineOffset < graph.horizontalLines; lineOffset++) {

        let offsetValue = lineOffset * graph.width / graph.horizontalLines;

        let line = document.createElementNS(svgNS, "line");
        line.setAttributeNS(null, "x1", graph.width - offsetValue + "vw");
        line.setAttributeNS(null, "x2", graph.width - offsetValue + "vw");
        line.setAttributeNS(null, "y1", graph.height + "px");
        line.setAttributeNS(null, "y2", 0);

        if (lineOffset % graph.indexDeviderIntervalHorizontal === 0) {
            line.setAttributeNS(null, "class", "graphBgLineDevider");
        } else {
            line.setAttributeNS(null, "class", "graphBgLine");
        }

        graph.htmlElement.appendChild(line);
    }

    for (let lineOffset = 0; lineOffset < graph.verticalLines; lineOffset++) {
        let line = document.createElementNS(svgNS, "line");

        let offsetValue = lineOffset * graph.height / graph.verticalLines;

        console.log(offsetValue);

        line.setAttributeNS(null, "x1", graph.width + "vw");
        line.setAttributeNS(null, "x2", 0);
        line.setAttributeNS(null, "y1", graph.height - offsetValue + "px");
        line.setAttributeNS(null, "y2", graph.height - offsetValue + "px");
        line.setAttributeNS(null, "class", "graphBgLine");

        if (lineOffset % graph.indexDeviderIntervalVertical === 0) {
            line.setAttributeNS(null, "class", "graphBgLineDevider");
        } else {
            line.setAttributeNS(null, "class", "graphBgLine");
        }

        graph.htmlElement.appendChild(line);
    }


}