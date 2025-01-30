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

    db.run(`
        INSERT INTO visitors (count, time)
        VALUES (${numOfClients}, datetime('now'))
    `);

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

/* Database */
const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:'); // in-memory database

process.on('SIGINT', () => {
    wss.clients.forEach(function each(client) {
        client.close();
    });

    server.close(() => {
        shutdownDB();
    });
});

db.serialize(() => {
    db.run(`
        CREATE TABLE visitors (
            count INTEGER,
            time  TEXT
        )
    `);
});

function getCounts() {
    db.each('SELECT * FROM visitors', (err, row) => {
        console.log(row);
    });
}

function shutdownDB() {
    getCounts();
    console.log('Shutting down database...');
    db.close();
}