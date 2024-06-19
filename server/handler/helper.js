import { CLIENT_VERSION } from '../constants.js';
import { removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';
import { getHighScore } from '../models/score.model.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id);
};

export const handleConnection = async (socket, uuid) => {
  const highScore = await getHighScore(uuid);

  socket.emit('connection', { uuid, highScore });
};

export const handlerEvent = (socket, data, io) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch!' });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = handler(data.userId, data.payload, io);

  // 모든 유저에게 보내는 정보
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }

  // 유저 한명에게만 보내는 정보
  socket.emit('response', response);
};
