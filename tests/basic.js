var server = require('./lib/server');

var Client = require('../lib/Client');
var client = new Client({ host: 'localhost:59903', logLevel: 'OFF' });

exports.json = function(test) {

	client.get({
		url: '/json',
		success: function(data) {
			test.deepEqual(data, { results: 42 }, "we get back json for json");
			test.done();
		}
	});
};

exports.jsonUnannounced = function(test) {

	client.get({
		url: '/json-unannounced',
		success: function(data) {
			test.deepEqual(data, { results: 42 }, "we get back json for unannounced json");
			test.done();
		}
	});
};

exports.badRequest = function(test) {

	client.get({
		url: '/400',
		error: function(data, response) {
			test.equal(response.statusCode, 400, "we get a bad request for a bad request");
			test.deepEqual(data, { error: "bad request" });
			test.done();
		}
	});
};

exports.badResponse = function(test) {

	client.get({
		url: '/content-type-liar',
		error: function(data, response, err) {
			test.ok(err.match(/couldn't parse/), "bogus JSON balks");
			test.done();
		}
	});
};

exports.timeout = function(test) {

	client.get({
		url: '/timer-200ms',
		timeout: 100,
		error: function(data, response, err) {
			test.equal(data.error.code, 'ETIMEDOUT', "low timeout times out");
			test.done();
		}
	});
};

exports.loris = function(test) {

	client.get({
		url: '/reverse-slowloris',
		timeout: 100,
		error: function(data, response, err) {
			test.equal(data.error.code, 'ESOCKETTIMEDOUT', "hopeless request times out");
			test.done();
		}
	});
};

exports.setUp = function(callback) {
	server.listen(59903, null, null, callback);
};

exports.tearDown = function(callback) {
	server.close(callback);
};

