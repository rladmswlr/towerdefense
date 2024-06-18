// 서버측 점수(score) 관리
let score = 0;

export const setScore = (data) => {
  score = data;   // data.score?
}

export const getScore = () => {
  return score;
}

