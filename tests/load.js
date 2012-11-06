var Client = require('../lib/Client');

exports.simple = function(test) {
	var client = new Client('localhost:59903');
	test.equal(client.host, 'localhost');
	test.equal(client.port, 59903);
	test.done();
};

exports.object = function(test) {
	var client = new Client({ host: 'localhost', port: 59903 });
	test.equal(client.host, 'localhost');
	test.equal(client.port, 59903);
	test.done();
};
