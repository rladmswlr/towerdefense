import { CLIENT_VERSION } from '../constants.js';
import { removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';
import { getHightScoreUsers } from '../models/score.model.js';
import jwt from 'jsonwebtoken';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id);
};

export const handleConnection = async (socket, uuid) => {
  // 토큰 추출: WebSocket 쿼리 파라미터에서 토큰을 가져옵니다.
  const token = socket.handshake.query.token.split(' ');
  try {
    const decodedToken = jwt.verify(token[1], process.env.CUSTOM_SECRET_KEY);
    const highScoreList = await getHightScoreUsers(decodedToken);
    const highScore = highScoreList[0].highscore;
    socket.emit('connection', { uuid, highScore});
  } catch (error) {
    socket.emit('connection', { status: 'fail', message: 'Invalid or expired token' });
    socket.disconnect(); // 토큰 검증 실패 시 연결 종료
  }
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

  const response = handler(data.userId, data.payload, socket, io);

  // 모든 유저에게 보내는 정보
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }

  // 유저 한명에게만 보내는 정보
  socket.emit('response', response);
};
