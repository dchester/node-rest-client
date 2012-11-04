# node-services-client

High-level REST / services client for Node.js

## Example

In your `config` file:

```javascript
{
	services: {
		github: "api.github.com",
		metacpan: "api.metacpan.org"
	}
}
```

In your application code:

```javascript
var services = require('node-services-client');

services.github.get({
	url: '/orgs/:organization',
	query: { organization: 'shutterstock' },
	success: function(results) {
		// do something
	},
	error: function() {
		// handle errors
	}
});
```

## Methods

### get(), post(), put(), delete(), head()

Make an HTTP request to the service, given options as described below.

##### url

The path component of the URL.  URLs may have sinatra-style interpolation tokens to be filled in by values from `query`.

##### query

Object representing query string parameters to be sent with the request.

##### success

Callback to be executed upon success, with the deserialized response as the first parameter, followed by the full response object.

##### error

Callback to be executed upon failure, with the deserialized response as the first parameter, followed by the full response object.
