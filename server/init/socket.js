import {Server as SocketID} from 'socket.io'
import registerHandler from '../handlers/register.handler.js';

const initSocket = (server) => {
    const io = new SocketID();
    io.attach(server);

    registerHandler(io);
}

export default initSocket;