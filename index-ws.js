const express = require('express');
const server = require('http').createServer();
const port = 3000;
const app = express();

app.get('/', (req, res) => {
	res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});

/**
 *  Begin WebSockets 
 */
const WebsocketServer = require('ws').Server;
const wss = new WebsocketServer({ server });

wss.on('connection', function connection(ws) {
    const numOfClients = wss.clients.size;
    console.log(`Clients connected: ${numOfClients}`);

    wss.broadcast(`Current visitors: ${numOfClients}`);

    if (ws.readyState === ws.OPEN) {
        ws.send('Welcome to my server!');
    }

    ws.on('close', function close() {
        console.log('A client has disconnected...');
        wss.broadcast('A client has disconnected...');
    });
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};
