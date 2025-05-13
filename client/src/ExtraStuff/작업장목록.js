import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import axios from 'axios';

export default function App() {
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

  // 16개로 채우기 (부족하면 '-' 추가)
  const filledCodes = [...commonCodes.slice(2, 5)];
  while (filledCodes.length < 12) {
    filledCodes.push({ displayname: '-' });
  }

  // 3개씩 묶기
  const rows = [];
  for (let i = 0; i < filledCodes.length; i += 3) {
    rows.push(filledCodes.slice(i, i + 3));
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        overflowY: 'auto',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h5" align="left" gutterBottom>
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
                fontSize: '4vw',
                backgroundColor: 'lightgrey',
                color: 'black',
              }}
            >
              {code.displayname}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}
