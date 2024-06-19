// 서버측 점수(score) 관리
let score = 0;
let scoreChecker = 0;
let level = 1;

let highScore = 0;

export const setScore = (data) => {
  score = data;   // data.score?
}
export const gainScore = (data) => {
  score += data;  // data.score?
  scoreChecker += data;
}
export const getScore = () => {
  return score;
}

export const setLevel = (data) => {
  level = data;   // data.level?
}
export const increaseLevel = () => {
  if(scoreChecker % 2000 == 0) {
    level += 1;
    scoreChecker = 0;
  }
}
export const getLevel = () => {
  return level;
}

export const initLevel = () => {
  
}