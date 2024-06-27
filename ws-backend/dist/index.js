"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const PubSubManager_1 = require("./PubSubManager");
const app = (0, express_1.default)();
const httpServer = app.listen(8080);
const wss = new ws_1.WebSocketServer({ server: httpServer });
let userCount = 0;
wss.on('connection', function connection(socket) {
    socket.on('error', console.error);
    socket.on('message', function message(data, isBinary) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("received a message from User with id:", data.toString());
            const userId = data.toString();
            PubSubManager_1.PubSubManager.getInstance().addUserToStock(userId, "APPL", socket);
            // wss.clients.forEach(function each(client) {
            //   if (client.readyState === WebSocket.OPEN) {
            //     client.send(data, { binary: isBinary });
            //   }
            // })
        });
    });
    console.log("user connected", ++userCount);
    socket.send('Hello! You have connected to the Websocket server');
});
