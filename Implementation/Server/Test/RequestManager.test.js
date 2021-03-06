const assert = require('assert');
const rqstMngr = require('./../RequestManager.js');
const da = require('./../DatabaseAccessorGraph.js');
const forecaster = require('./../Forecaster.js');

if (true) {
    describe('Request Manager', () => {

        // Request Time To Run
        it('requestTimeToRun: Expected output and not undefined output', async () => {
            da.dropDatabase();
            let graph = [21, 13, 22, 29];
            let timeIntervalObject = {
                start: new Date(2010, 0, 24, 15, 30),
                end: new Date(2010, 0, 24, 18, 30)
            };
            // Change this once blackbox of Fit Demand Graph is done (Not Needed for MVP)
            let expectedFinishTime = new Date(2010, 0, 24, 15, 34);

            let res = await rqstMngr.requestTimeToRun(graph, timeIntervalObject);

            assert(res.start !== undefined &&
                res.start.getTime() === timeIntervalObject.start.getTime() &&
                res.end !== undefined &&
                res.end.getTime() === expectedFinishTime.getTime()
            );
        });
        it('requestTimeToRun: Checks if graph is written to database', async () => {
            da.dropDatabase();
            let graph = [
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37
            ];
            let timeIntervalObject = {
                start: new Date(2010, 0, 24, 15, 30),
                end: new Date(2010, 0, 24, 18, 30)
            };
            let expectedLowerGraph = [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37
            ];
            let expectedUpperGraph = [
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ];

            await rqstMngr.requestTimeToRun(graph, timeIntervalObject);

            let lowerGraph = await da.getGraph("demandGraph-Y2010-M0-D24-H15");
            let upperGraph = await da.getGraph("demandGraph-Y2010-M0-D24-H16");

            assert(JSON.stringify(lowerGraph.values) === JSON.stringify(expectedLowerGraph) &&
                JSON.stringify(upperGraph.values) === JSON.stringify(expectedUpperGraph));
        });

        // Remove current demnad
        it('removeCurrentDemand: Checks if current demand is actually removed', async () => {
            da.dropDatabase();
            let graph = [
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                21, 13, 22, 29, 35, 10, 17, 20, 39, 37
            ];
            let currentSchedule = {
                start: new Date(2010, 0, 24, 15, 45),
                end: new Date(2010, 0, 24, 16, 45)
            };
            let expectedGraph = [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ];

            let res = await forecaster.addDemand(currentSchedule.start, graph);

            await rqstMngr.removeCurrentDemand(currentSchedule, graph);

            let lowerGraph = await da.getGraph("demandGraph-Y2010-M0-D24-H15");
            let upperGraph = await da.getGraph("demandGraph-Y2010-M0-D24-H16");

            assert(res === true &&
                JSON.stringify(lowerGraph.values) === JSON.stringify(expectedGraph) &&
                JSON.stringify(upperGraph.values) === JSON.stringify(expectedGraph));
        });

        // gatherSurplusGraph: Test not done, commented out (Not needed for MVP)
        /*
        it('gatherSurplusGraph: Testing if surplus graph is gathered', async() => {
            let graph = [21, 13, 22, 29];
            let isScheduled = true;
            let timeIntervalObject = {
                start: new Date(2010, 0, 24, 15, 30),
                end: new Date(2010, 0, 24, 18, 30)
                };
        });
        */
    });
}