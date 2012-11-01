var request = require('request');
var util = require('util');
var querystring = require('querystring');
var url = require('url');

var service = function(args) {

	args = args || {};

	this.host = args.host;
	this.request = request.defaults();
};

var methods = ['GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'OPTIONS'];

methods.forEach( function(method) {

	var instanceMethod = method.toLowerCase();

	service.prototype[instanceMethod] = function(args, callback) {

		var pathname = args.url.replace(/:(\w+)/g, function(match, $1) { 
			var value = args.query[$1];
			delete args.query[$1];
			return value;
		});

		var query = querystring.stringify(args.query || {});

		var requestURL = url.format({
			protocol: args.protocol || 'http',
			host: this.host,
			pathname: pathname,
			search: query
		});

		var startTime = new Date();
		util.log(instanceMethod.toUpperCase() + " " + requestURL + " (request)");

		args.method = method;
		args.url = requestURL;

		this.request( args, function(err, response, body) {

			var requestDuration = new Date() - startTime;

			util.log(instanceMethod.toUpperCase() + " " + requestURL + " (response: " + requestDuration + " ms)");

			if (!err) {
				try { var data = typeof body === 'object' ? body : JSON.parse(body) } 
				catch (e) { console.warn("couldn't parse json: " + url + ' | ' + body) };
			}

			if (err && (args.error)) { args.error() } 
 			else if (err) { console.warn(err) }
			else if (!err && args.success) { args.success(data) }
			else { callback(err, response, data || body) }

		} );
	};
} );

module.exports = service;
