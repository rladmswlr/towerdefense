import { addUser } from "../models/user.model.js";
import {v4 as uuidv4} from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";

const registerHandler = (io) => {
    io.on('connection', (socket) => {
        // 이벤트 처리

        // 유저 접속시
        const userUUID = uuidv4();
        addUser( {uuid : userUUID, socketId: socket.id })

        handleConnection(socket, userUUID);

        // 접속 해제시 이벤트
        socket.on('event', (data) => handlerEvent(io, socket, data));
        socket.on('disconnect', (socket) => handleDisconnect(socket, userUUID));
    })
}

export default registerHandler;