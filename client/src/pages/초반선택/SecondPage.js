import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import axios from 'axios';

export default function SecondPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { username, plantNumber, selectedProcess } = location.state || {};
  const [commonCodes, setCommonCodes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/getCommonCode')
      .then((response) => {
        setCommonCodes(response.data);
      })
      .catch((error) => {
        console.error('데이터 가져오기 실패:', error);
      });
  }, []);

  const filteredCodes = commonCodes.filter(code => code.categorycode === 'lineGroup')

  // 16개로 채우기 (부족하면 '-' 추가)
  //필터해서 상관없음 슬라이스 일단 100까지
  const filledCodes = [...filteredCodes.slice(0,100)];
  while (filledCodes.length < 12) {
    filledCodes.push({ displayname: '-' });
  }

  // 3개씩 묶기
  const rows = [];
  for (let i = 0; i < filledCodes.length; i += 3) {
    rows.push(filledCodes.slice(i, i + 3));
  }

  const handleButtonClick = (selectedCode) => {
    navigate('/third', {
        state: {
            username,
            plantNumber,
            selectedProcess,
            selectedCode
        }
    })
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>환영합니다, {username}님</h1>
      {/* <p><strong>사용자:</strong> {username}</p> */}
      <p><strong>공장 번호:</strong> {plantNumber}</p>
      <p><strong>선택된 공정:</strong> {selectedProcess?.displayname || '없음'}</p>

      {/* 작업장 목록 */}
      <Typography variant="h5" align="left" gutterBottom sx={{ marginTop: '30px' }}>
        ● 작업장 목록
      </Typography>

      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '20px',
            justifyContent: 'center',
          }}
        >
          {row.map((code, colIndex) => (
            <Button
              key={colIndex}
              variant="contained"
              sx={{
                width: '30vw',
                minWidth: '100px',
                aspectRatio: '1.6',
                fontSize: '3vw',
                backgroundColor: 'lightgrey',
                color: 'black',
              }}
              onClick={() => handleButtonClick(code)}
            >
              {code.displayname}
            </Button>
          ))}
        </div>
      ))}
      <Button
        variant="contained"
        onClick={() => navigate(-1)}
        sx={{ marginTop: '20px', backgroundColor: 'lightgrey', color: 'black'}}
      >
        뒤로가기
      </Button>
    </div>
  );
}
