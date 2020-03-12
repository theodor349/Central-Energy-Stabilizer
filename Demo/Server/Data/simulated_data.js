function sim_data(time) {
	return (15*(Math.sin((3*time)/100)*Math.cos((12*time)/100))) + 15;
}

module.exports = sim_data;
