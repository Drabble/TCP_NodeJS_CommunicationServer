// Include Nodejs' net module.
const net = require('net');
// The port on which the server is listening.
const port = process.env.PORT || 80;

// Keep track of the chat clients
var clients = [];

// Use net.createServer() in your code. This is just for illustration purpose.
// Create a new TCP server.
const server = new net.Server();
// The server listens to a socket for a client to make a connection request.
// Think of a socket as an end point.
server.listen(port, function() {
    console.log(`Server listening for connection requests on socket localhost:${port}`);
});

// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
server.on('connection', function(socket) {
    console.log('A new connection has been established.');
	
	// Put this new client in the list
	clients.push(socket);

    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.
    socket.write('Hello, client.');

    // The server can also receive data from the client by reading from its socket.
    socket.on('data', function(chunk) {
        console.log(`Data received from client: ${chunk.toString()}`);
		clients.forEach(function (client) {
			// Don't want to send it to sender
			if (client === socket){
				return;
			}
			client.write(chunk);
		});
    });

    // When the client requests to end the TCP connection with the server, the server
    // ends the connection.
    socket.on('end', function() {
		clients.splice(clients.indexOf(socket), 1);
        console.log('Closing connection with the client');
    });

    // Don't forget to catch error, for your own sake.
    socket.on('error', function(err) {
		clients.splice(clients.indexOf(socket), 1);
        console.log(`Error: ${err}`);
    });
});