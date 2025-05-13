const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // POST 요청의 JSON 바디를 처리하기 위한 설정

// PostgreSQL 연결 세팅
const pool = new Pool({
  user: 'postgres',           // 너의 PostgreSQL 아이디
  host: 'localhost',          // DB 주소 (로컬이면 localhost)
  database: 'postgres',  // 사용할 데이터베이스 이름
  password: 'borakim123',         // DB 비번
  port: 5432,                 // PostgreSQL 기본 포트
});

// API 만들기
app.get('/getProductionOrderSet', async (req, res) => {
  console.log("Received Request");
  try {
    const result = await pool.query('SELECT * FROM productionorderset');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying database');
  }
});

app.get('/getCommonCode', async (req, res) => {
  console.log("Received Request");
  try {
    const result = await pool.query('SELECT * FROM commoncode');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying database');
  }
});

app.get('/getProduction', async (req, res) => {
  console.log("Received Request");
  try {
    const result = await pool.query('SELECT * FROM production');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying database');
  }
});

// 생산량 업데이트 API 추가
app.post('/updateProduction', async (req, res) => {
  const { orderno, amount, time } = req.body;

  if (!orderno || !amount || !time) {
    return res.status(400).send('orderno와 amount, time이 필요합니다.');
  }

  try {
    // 먼저 해당 orderno로 기존 데이터가 있는지 확인
    const result = await pool.query('SELECT * FROM production WHERE orderno = $1', [orderno]);

    if (result.rows.length > 0) {
      // 기존 데이터가 있으면 업데이트
      await pool.query('UPDATE production SET amount = $1, time = $2 WHERE orderno = $3', [amount, time, orderno]);
      res.status(200).send('생산량과 시간이 업데이트되었습니다.');
    } else {
      // 기존 데이터가 없으면 새로 삽입
      await pool.query('INSERT INTO production (orderno, amount, time) VALUES ($1, $2, $3)', [orderno, amount, time]);
      res.status(200).send('새로운 생산량이 저장되었습니다.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('생산량 업데이트 중 오류가 발생했습니다.');
  }
});

// 서버 시작
app.listen(port, '0.0.0.0', () => {
  console.log(`Server Running: http://0.0.0.0:${port}`);
});
