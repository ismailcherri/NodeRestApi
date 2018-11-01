/*
 * Entry point to start the API server
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// Creates HTTP server
const httpServer = http.createServer(function(req, res){
    unifiedServer(req, res);
});

// Starts listening on the port from configuration
httpServer.listen(config.httpPort, function(){
    console.log('The server is listening on port ' + config.httpPort + ' as ' + config.envName);
});

// HTTPS server options
const httpsServerOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
};

// Creates the HTTPS server
const httpsServer = https.createServer(httpsServerOptions, function(req, res){
    unifiedServer(req, res);
});

// Starts listening on the port from configuration
httpsServer.listen(config.httpsPort, function(){
    console.log('The server is listening on port ' + config.httpsPort + ' as ' + config.envName);
});

// A common entry point for both HTTP and HTTPS server
const unifiedServer = function(req, res){
    //Get the url and parse it
    const parsedUrl = url.parse(req.url, true);

    //Get the path form the url
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get the query string as an object
    const queryStringObject = parsedUrl.query;

    //Get the HTTP method
    const method = req.method.toLowerCase();

    //Get the headers as an object
    const headers = req.headers;

    //Get the payload
    const decoder = new StringDecoder('utf-8');
    let payload = '';
    req.on('data', function(data){
        payload += decoder.write(data);
    });

    // Listener for the end event on the request
    req.on('end', function () {
        payload += decoder.end();

        // Gets the correct handler
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Constructs the data
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload
        };

        // Executes the handler
        chosenHandler(data, function(statusCode, payload){
            // Use the status code called back by the handler or defaults to 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            // Use the payload called back by the handler or defaults to empty object
            payload = typeof(payload) === 'object' ? payload : {};

            // Converts the payload into a string
            const payloadString = JSON.stringify(payload);

            // Returns the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the information
            console.log(statusCode, payloadString);
        });
    });
};

//Define the handlers
const handlers = {};

//Hello handler
handlers.hello = function(data, callback){
    callback(200, {
        'message': 'Hello World from Node.js!'
    });
};

//Not found handler
handlers.notFound = function(data, callback){
    callback(404, {
        'message': 'Route not found!'
    })
};

// Define a request router
const router = {
    'hello': handlers.hello
};