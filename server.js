const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('.'));

const connections = {
    broadcaster: null,
    viewer: null
};

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'broadcaster':
                connections.broadcaster = ws;
                console.log('Broadcaster connected');
                break;
            case 'viewer':
                connections.viewer = ws;
                console.log('Viewer connected');
                if (connections.broadcaster) {
                    connections.broadcaster.send(JSON.stringify({ type: 'viewerConnected' }));
                }
                break;
            case 'offer':
            case 'answer':
            case 'candidate':
                forwardMessage(data);
                break;
        }
    });

    ws.on('close', () => {
        if (ws === connections.broadcaster) {
            connections.broadcaster = null;
            if (connections.viewer) {
                connections.viewer.send(JSON.stringify({ type: 'broadcasterDisconnected' }));
            }
            console.log('Broadcaster disconnected');
        } else if (ws === connections.viewer) {
            connections.viewer = null;
            if (connections.broadcaster) {
                connections.broadcaster.send(JSON.stringify({ type: 'viewerDisconnected' }));
            }
            console.log('Viewer disconnected');
        }
    });
});

function forwardMessage(message) {
    const target = message.type === 'offer' ? connections.viewer : connections.broadcaster;
    if (target && target.readyState === WebSocket.OPEN) {
        target.send(JSON.stringify(message));
    }
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});