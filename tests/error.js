var Client = require('../lib/Client');
var client = new Client({ host: 'localhost:59903', logLevel: 'OFF' });

exports.connectionRefused = function(test) {

	client.get({
		url: '/json',
		error: function(data) {
			test.deepEqual(data.error.code, 'ECONNREFUSED', "connection refused for no server running");
			test.done();
		}
	});
};



