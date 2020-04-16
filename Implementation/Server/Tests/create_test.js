const assert = require('assert');
const Device = require('../DatabaseAccessor.js');

describe('Creating documents', () =>
	{
		it('creates a device', (done) => {
			const device = new Device();
			device.save().then(() => {
				assert(!device.isNew);
				done();
			});
		});
	});
