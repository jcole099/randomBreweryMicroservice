// Author: James Cole
// Date: 02/04/23
// Prereqs: npm install socket.io request forever
// Usage: npm start                         -non persistent
// Usage: forever start server.js           -persistent
// Description: A microservice for Stephanie Cox's CS361 brewery finder application.
//  This microservice will listen on port 44441 for WebSocket protocol request 'getRandBrewery'
//  will then request a random brewery object from Open Brewery API, will then send the data
//  to the client via WebSocket protocol.

const PORT = 44441;
//An HTTP request library that uses simple, user-friendly syntax to make requests
const request = require('request');
//socket.io declaration
const { createServer } = require("http"); 
const { Server } = require('socket.io');
const httpServer = createServer(); 

console.log(`Listening on for socket connect on port: ${PORT}...`);

const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

httpServer.listen(PORT);

io.on('connection', (socket) => {
	// HTTP request to the API
	request(
		'https://api.openbrewerydb.org/breweries/random',
		{ json: true },
		(err, res, body) => {
			if (err) {
				return console.log(err);
            }
            //Sends data back to the client
            //Route 'getRandBrewery' must be used in the client code
			socket.emit('getRandBrewery', body);
		}
	);
});



///////////////////////////////
// CLIENT CODE
//  Description: this is the code that I used for testing. Preserving it for future reference
//  Prereqs: npm install socket.io-client

// const { io } = require("socket.io-client");
// const socket = io("ws://jcole.net:44441");

// socket.on("getRandBrewery", (breweryInfo) => {
//   console.log(breweryInfo);
//   socket.disconnect();
// });
