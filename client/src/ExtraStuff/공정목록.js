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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Typography variant="h5" align="left" gutterBottom>
        ● 공정목록
      </Typography>
      <div
        style={{
          display: 'flex',
          gap: '20px',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {commonCodes.slice(0,2).map((code, index) => (
          <Button
            key={index}
            variant="contained"
            sx={{
              width: '50vw',
              aspectRatio: '1',
              fontSize: '5vw',
              backgroundColor: 'lightgrey',
              color: 'black',
            }}
          >
            {code.displayname}
          </Button>
        ))}
      </div>
    </div>
  );
}
