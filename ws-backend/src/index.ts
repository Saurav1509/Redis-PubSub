import express from 'express'
import { WebSocket, WebSocketServer } from 'ws'
import { createClient } from 'redis'
import { PubSubManager } from './PubSubManager';

const app = express();

const httpServer = app.listen(8080);

const wss = new WebSocketServer({ server: httpServer });
let userCount = 0;
wss.on('connection', function connection(socket) {
  socket.on('error', console.error);
  socket.on('message', async function message(data, isBinary) {
    console.log("received a message from User with id:", data.toString())

    const userId = data.toString();

    PubSubManager.getInstance().addUserToStock(userId, "APPL", socket)

    // wss.clients.forEach(function each(client) {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(data, { binary: isBinary });
    //   }
    // })
  });

  // socket.on('close', function close() {
  //   PubSubManager.getInstance().removeUserFromStock(userId, "APPL");
  // })
  console.log("user connected", ++userCount);
  socket.send('Hello! You have connected to the Websocket server')
});

