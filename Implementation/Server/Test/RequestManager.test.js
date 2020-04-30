const assert = require('assert');
const rqstMngr = require('./../RequestManager.js');
const da = require('./../DatabaseAccessorGraph.js');
const forecaster = require('./../Forecaster.js');

if (true) {
    describe('Request Manager', () => {
        it('requestTimeToRun: expected output and not undefined output', async() => {
            da.dropDatabase();
            let graph = [21, 13, 22, 29];
            let isScheduled = false;
            let timeIntervalObject = {
                timeIntervalStart: new Date(2010, 0, 24, 15, 30),
                timeIntervalFinish: new Date(2010, 0, 24, 18, 30)
                };
            // Change this once blackbox of Fit Demand Graph is done
            let expectedFinishTime = new Date(2010, 0, 24, 15, 34);
            let currentSchedule = undefined;

            let res = await rqstMngr.requestTimeToRun(graph, isScheduled, timeIntervalObject, currentSchedule);

            assert(res.outputIntervalStart !== undefined &&
                    res.outputIntervalStart.getTime() === timeIntervalObject.timeIntervalStart.getTime() &&
                    res.outputIntervalFinish !== undefined &&
                    res.outputIntervalFinish.getTime() === expectedFinishTime.getTime()
                    );
        });

        /*
        it('gatherSurplusGraph: Testing if surplus graph is gathered', async() => {
            let graph = [21, 13, 22, 29];
            let isScheduled = true;
            let timeIntervalObject = {
                timeIntervalStart: new Date(2010, 0, 24, 15, 30),
                timeIntervalFinish: new Date(2010, 0, 24, 18, 30)
                };
        });

        it('requestTimeToRun: isScheduled === true', async() => {
            da.dropDatabase();
            let graph = [21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                        21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                        21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                        21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                        21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                        21, 13, 22, 29, 35, 10, 17, 20, 39, 37];
            let isScheduled = true;
            let timeIntervalObject = {
                timeIntervalStart: new Date(2010, 0, 24, 15, 30),
                timeIntervalFinish: new Date(2010, 0, 24, 18, 30)
                };
            let currentSchedule = {
                timeIntervalStart: new Date(2010, 0, 24, 15, 45),
                timeIntervalFinish: new Date(2010, 0, 24, 16, 45)
            };
            let expectedFinishTime = new Date(2010, 0, 24, 16, 45);
            
            let expectedLowerGraph = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                        21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                                        21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                                        21, 13, 22, 29, 35, 10, 17, 20, 39, 37
            ];
            let expectedUpperGraph = [ 21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                                        21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                                        21, 13, 22, 29, 35, 10, 17, 20, 39, 37,
                                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ];


            forecaster.addDemand(currentSchedule.timeIntervalStart, graph);
            
            let res = await rqstMngr.requestTimeToRun(graph, isScheduled, timeIntervalObject, currentSchedule);   

            let lowerGraph = await da.getGraph("demandGraph-Y2010-M0-D24-H15");
            let upperGraph = await da.getGraph("demandGraph-Y2010-M0-D24-H16");


            assert(JSON.stringify(lowerGraph.values) === JSON.stringify(expectedLowerGraph) &&
                JSON.stringify(upperGraph.values) === JSON.stringify(expectedUpperGraph));


        });
        */
    }); 
}
