import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import axios from 'axios';

export default function ThirdPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 'state'에서 모든 값 가져오기
  const { username, plantNumber, selectedProcess, selectedCode } = location.state || {};

  // 라인 목록을 저장할 상태 변수
  const [lineCodes, setLineCodes] = useState([]);

  // 'line' 카테고리 코드에 해당하는 항목을 불러오기
  useEffect(() => {
    axios.get('https://mes-erp.onrender.com/getCommonCode') // API 호출
      .then((response) => {
        // 'categorycode'가 'line'인 항목만 필터링
        const filteredLines = response.data.filter(code => code.categorycode === 'line');
        setLineCodes(filteredLines); // 상태에 라인 목록 저장
      })
      .catch((error) => {
        console.error('데이터 가져오기 실패:', error);
      });
  }, []);

  // 12개 버튼이 되도록 '-' 추가
  const filledLines = [...lineCodes];
  while (filledLines.length < 8) {
    filledLines.push({ displayname: '-' });
  }

  // 2개씩 묶기
  const rows = [];
  for (let i = 0; i < filledLines.length; i += 2) {
    rows.push(filledLines.slice(i, i + 2));
  }

  // 버튼 클릭 시 FourthPage로 선택된 정보 넘기기
  const handleLineClick = (line) => {
    navigate('/fourth', {
      state: {
        username,
        plantNumber,
        selectedProcess,
        selectedCode,
        selectedLine: line,  // 선택된 라인 정보 전달
      }
    });
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>환영합니다, {username}님</h1>

      {/* 전달된 사용자 정보 표시 */}
      <div style={{ marginTop: '20px' }}>
        <p><strong>공장 번호:</strong> {plantNumber}</p>
        <p><strong>선택된 공정:</strong> {selectedProcess?.displayname || '없음'}</p>
        <p><strong>선택된 작업장:</strong> {selectedCode?.displayname || '없음'}</p>
      </div>

      {/* 라인 목록 */}
      <Typography variant="h5" align="left" gutterBottom sx={{ marginTop: '30px' }}>
        ● 라인 목록
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
          {row.map((line, colIndex) => (
            <Button
              key={colIndex}
              variant="contained"
              sx={{
                width: '40vw',
                minWidth: '100px',
                height: '10vw',
                minHeight: '100px',
                aspectRatio: '1.6',
                fontSize: '2vw',
                backgroundColor: 'lightgrey',
                color: 'black',
              }}
              onClick={() => handleLineClick(line)}  // 클릭 시 FourthPage로 이동
            >
              {line.displayname}
            </Button>
          ))}
        </div>
      ))}

      <Button
        variant="contained"
        onClick={() => navigate(-1)}  // 뒤로 가기
        sx={{ marginTop: '20px', backgroundColor: 'lightgrey', color: 'black' }}
      >
        뒤로가기
      </Button>
    </div>
  );
}
