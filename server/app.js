import express from "express";
import { createServer } from "http";

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded( {extended: false} ));
initSocket(server);

app.get('/', (req, res, next) => {
  const res_str ="Hello World! Wow! What a beatiful world!";
  res.send(res_str);
});

server.listen(PORT, async () => {
  console.log(`서버는 포트: ${PORT} 에서 실행중 입니다.`);

  // 이곳에서 파일 읽음
  try {
    const assets = await loadGameAssets();
    console.log(assets);
    console.log('Assets 로드 성공');
  } catch(err) {
    console.error('Failed to load game assets', err);
  }
});
