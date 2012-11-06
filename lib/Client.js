var request = require('request');
var util = require('util');
var querystring = require('querystring');
var url = require('url');
var log4js = require('log4js');
var url = require('url');

var jsonSerializer = {
	contentType: 'application/json',
	serialize: JSON.stringify,
	deserialize: JSON.parse
};

var extend = function(destination, source) {

	for (var property in source) {
		destination[property] = source[property];
	}
	return destination;
};

var Client = function(args) {

	args = typeof args === 'string' ? { base: args } : args;

	this.log = args.logger;

	if (!this.log) {

		var logLevel = args.logLevel || process.env.LOG_LEVEL || 'info';
		this.log = log4js.getLogger('rest-client');
		this.log.setLevel(logLevel.toUpperCase());
	}

	if (args.base) {

		var urlComponents = url.parse(args.base);

		this.protocol = urlComponents.protocol || 'http';
		this.host = urlComponents.hostname;

	} else {

		this.protocol = args.protocol || 'http';
		this.host = [args.host, args.port]
			.filter(function(v) { return v })
			.join(':');
	}

	this.serializer = args.serializer || jsonSerializer;
	this.timeout = args.timeout;

	this.request = request.defaults();
};

var methods = ['GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'OPTIONS'];

methods.forEach( function(method) {

	var instanceMethod = method.toLowerCase();

	Client.prototype[instanceMethod] = function(args, callback) {

		var log = this.log;

		var query = args.query || {};
		var data = args.body || {};

		// divvy up request parameters according to convention

		if (instanceMethod === 'get' || instanceMethod === 'head') {
			extend(query, args.params);
		}

		if (instanceMethod === 'post' || instanceMethod === 'put') {
			extend(data, args.params);
			args.headers = args.headers || {};
			args.headers['Content-Type'] = this.serializer.contentType;
			args.body = this.serializer.serialize(data);
		}

		// put together the URL

		var pathname = args.url.replace(/:(\w+)/g, function(match, $1) {
			var value = args.query[$1];
			delete args.query[$1];
			return value;
		});

		var requestURL = url.format({
			protocol: this.protocol,
			host: this.host,
			pathname: pathname,
			search: querystring.stringify(query)
		});

		args.method = method;
		args.url = requestURL;

		// set request options

		args.timeout = args.timeout || this.timeout;

		// set up callbacks

		var success = args.success || function() {};
		var error = args.error || function() {};
		var complete = args.complete || function() {};

		var startTime = new Date();
		log.debug(instanceMethod.toUpperCase() + " " + requestURL + " (request)");

		// make the request

		this.request(args, function(err, response, body) {

			var requestDuration = new Date() - startTime;
			var requestMethod = instanceMethod.toUpperCase();

			if (!response) {
				log.warn(requestMethod + " " + requestURL + " " + requestDuration + "ms " + err);
				error({ error: err });
				return complete(data, response, err);
			}

			var responseClass = (response.statusCode / 100 | 0) * 100;

			try {
				var data = typeof body === 'object' ? body : this.serializer.deserialize(body);
			}
			catch (e) {
				var data = body;
				err = "couldn't parse data: " + (body || "").substring(0, 40);
			};

			if (err || responseClass !== 200) {

				var message = [body, err].filter(function(m) { return m }).join(' | ');
				log.warn(requestMethod + " " + requestURL + " " + response.statusCode + " " + requestDuration + "ms " + message);
				error(data, response, err);
				return complete(data, response, err);

			} else {

				log.info(requestMethod + " " + requestURL + " " + response.statusCode + " " + requestDuration + "ms");
				success(data, response);
				return complete(data, response, err);
			}


		}.bind(this) );
	};
} );

module.exports = Client;
