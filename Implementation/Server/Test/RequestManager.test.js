const assert = require('assert');
const rqstMngr = require('./../RequestManager.js');
const da = require('./../DatabaseAccessorDevice.js');
/*

if (true) {
    describe('Request Manager', () => {
        it('requestTimeToRun: expected output and not undefined output', async() => {
            let graph = [21, 13, 22, 29];
            let isScheduled = true;
            let timeIntervalObject = {
                timeIntervalStart: new Date(2010, 1, 24, 15, 30),
                timeIntervalFinish: new Date(2010, 1, 24, 18, 30)
                };
            // Change this once blackbox of Fit Demand Graph is done
            let expectedFinishTime = new Date(2010, 1, 24, 15, 34);

            let res = rqstMngr.requestTimeToRun(graph, isScheduled, timeIntervalObject);
            assert(res.outputIntervalStart !== undefined &&
                    res.outputIntervalStart === timeIntervalObject.timeIntervalStart &&
                    res.outputIntervalFinish !== undefined &&
                    res.outputIntervalFinish === expectedFinishTime);
        });

        it('gatherSurplusGraph: Testing if surplus graph is gathered', async() => {
            let graph = [21, 13, 22, 29];
            let isScheduled = true;
            let timeIntervalObject = {
                timeIntervalStart: new Date(2010, 1, 24, 15, 30),
                timeIntervalFinish: new Date(2010, 1, 24, 18, 30)
                };
        });
    });
}
*/
