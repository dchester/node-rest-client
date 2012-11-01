var hosts = require('config').services;
var Service = require('./service');

var services = {};

for (service in hosts) {
	services[service] = new Service({ host: hosts[service] });
}

module.exports = services;

