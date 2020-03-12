function sim_data(time) {
	return (15*(Math.sin(3*time)*Math.cos(12*time))) + 15;
}

module.exports = sim_data;
