import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import dotenv from 'dotenv';
import { loadGameAssets } from '../server/init/assets.js';
import UserRouter from './routes/user.router.js';

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT_NUMBER;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('tower_defense_client'));

app.use('/api', [UserRouter]);
initSocket(server);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

loadGameAssets();

server.listen(PORT, async () => {
  console.log(`${PORT} Server가 열렸습니다`);
});
