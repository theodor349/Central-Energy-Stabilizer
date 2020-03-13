const simulatedData = require('../../../Core/simulated_data.js');

let today = new Date();
let timeInMinutes = today.getMinutes();

sim_data(timeInMinutes);
document.querySelectorAll(".windmill")
