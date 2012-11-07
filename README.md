# REST Client

A high-level HTTP / REST services client for Node.

## Example

Set up a client and issue a GET request:

```javascript
var Client = require('rest-client');

var github = new Client('http://api.github.com');

github.get({
	url: '/orgs/:organization',
	params: { organization: 'shutterstock' },
	success: function(organization) {
		// do something
	}
});
```

## Instantiating a REST Client

The constructor takes two forms: send the base URL as a string if that will get you going, or send an object with parameters below for more flexibility.

##### base

Base URL, including any or all of the scheme, host, port, and path.  This option overrides `host`, `scheme`, and `port`.

##### host

The host part of the base URL if `base` is not specified.

##### protocol

The scheme part of the base URL, either `http` or `https`.  Aliased as `scheme` as well for compatibility.

##### port

The port part of the base URL if `base` is not specified.

##### timeout

Number of milliseconds to wait first for establishing the socket connection and sending the request, and then again for receiving the response.

##### serializer

Optional parameter, an object specifying a `contentType`, and functions to `serialize` and `deserialize` request and response bodies.

##### logger

Instance of some logger that implements `debug()`, `info()`, `warn()`, and `error()`.

##### logLevel

String indicating criticality of messages to log; one of `debug`, `info`, `warn`, or `error`.

## Methods

### get(), post(), put(), delete(), head()

Make an HTTP request to the service, given the parameters below.

##### url

The path component of the URL.  URLs may have sinatra-style interpolation tokens to be filled in by values from params.

##### params

Paramaters to be sent with the request.  For HEAD and GET requests these will be sent as query string parameters.  For other HTTP methods, parameters will be serialized according to the serialization scheme associated with the client, and sent in the body of the request.

##### success

Callback to be executed upon success, with the deserialized response as the first parameter, followed by the full response object.

##### error

Callback to be executed upon failure, with the deserialized response as the first parameter, followed by the full response object.

##### complete

Callback to be executed upon completion, whether the request failed or succeeded, with the deserialized response as the first parameter, followed by the full response object.

> Additional parameters are passed through to [request](https://github.com/mikeal/request#requestoptions-callback).

## Client Registry

When you're working with a number of services at once, a registry helps to keep order.  See `rest-client-registry` for more.

##### Registering Services

Register backend services with a call to **register()**, sending a `name` parameter in addition to other parameters expected by **new()**:

```javascript
var services = require('rest-client-registry');

services.register('github', {
	base: 'http://api.github.com',
	timeout: 5000
});

services.register('metacpan', {
	name: 'metacpan',
	timeout: 5000
});

```

##### Consuming Services from the Registry

From elsewhere, load in the registry and interact with services by name.  Services in the registry are instances of [rest-client]:

```javascript
var services = require('rest-client-registry');

services.github.get(...);
services.metacpan.get(...);
```

