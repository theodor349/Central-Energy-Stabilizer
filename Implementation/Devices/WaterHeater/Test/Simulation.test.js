const assert = require('assert');
const app = require('./../App.js');

describe('Testing changing states', () =>
	{
		it('from on to off', () => {
            let info = app.getDeviceInfo();
            console.log(info);
			assert();
		});
	});
