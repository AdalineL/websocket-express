const express = require('express');
const path = require('path');
const WebSocket = require('ws'); // new
const app = express();

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
const port = 8080;
app.listen(port, () => {
  console.log(`listening http://localhost:${port}`);
});

const socketServer = new WebSocket.Server({port: 3030});

const messages = ['\n'];
socketServer.on('connection', (socketClient) => {
  console.log('connected');
  console.log('Number of clients: ', socketServer.clients.size);
  //console.log('username: ', socketServer.clients.size);
  socketClient.send(JSON.stringify(messages));
  
  socketClient.on('message', (message) => {
        console.log('message: ', message);
    messages.push(message);
    socketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify([message]));
      }
    });
  });

  socketClient.on('close', (socketClient) => {
    console.log('closed');
    console.log('Number of clients: ', socketServer.clients.size);
  });
});