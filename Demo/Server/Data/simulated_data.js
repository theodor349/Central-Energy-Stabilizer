let today = new Date();
let time = today.getMinutes();

function sim_data(timeInMinutes) {
  return (15 * (Math.sin((3 * timeInMinutes) / 100) * Math.cos((12 * timeInMinutes) / 100))) + 15;
}

module.exports = sim_data;