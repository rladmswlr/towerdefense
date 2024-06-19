import { addUser } from '../models/user.model.js';
import { gameStart } from './game.handler.js';
import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    const token = socket.handshake.query.token;
    addUser({ uuid: token, socketId: socket.id });
    handleConnection(socket, token);

    gameStart(token, socket);

    // 접속 해제시 이벤트
    socket.on('event', (data) => handlerEvent(socket, data, io));
    socket.on('disconnect', (socket) => handleDisconnect(socket, token));
  });
};

export default registerHandler;
