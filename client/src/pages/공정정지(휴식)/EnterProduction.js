import React, { useState } from 'react';
import { Box, Typography, Grid, Button, TextField } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EnterProduction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    username,
    plantNumber,
    selectedProcess,
    selectedCode,
    selectedLine,
    selectedLot
  } = location.state || {};

  const [amount, setAmount] = useState('');

  const handleSubmit = async () => {
    if (!amount || isNaN(amount)) {
      alert('생산량은 숫자로 입력해주세요.');
      return;
    }

    try {
      // 서버로 생산량 업데이트 요청 보내기
      const response = await axios.post('http://localhost:3000/updateProduction', {
        orderno: selectedLot.orderno,
        amount: parseInt(amount, 10),
        time: new Date().toISOString(),
      });

      if (response.status === 200) {
        // 성공적으로 저장되었을 때
        alert('생산량이 성공적으로 업데이트되었습니다.');
        navigate(-1); // 이전 페이지로 돌아가기
      } else {
        alert('서버 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('생산량 업데이트 실패', error);
      alert('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" align="center" gutterBottom>
        생산 실적 입력
      </Typography>

      <Box mt={3} mb={5} textAlign="center">
        <Typography><strong>사용자:</strong> {username}</Typography>
        <Typography><strong>공장 번호:</strong> {plantNumber}</Typography>
        <Typography><strong>공정:</strong> {selectedProcess?.displayname}</Typography>
        <Typography><strong>작업장:</strong> {selectedCode?.displayname}</Typography>
        <Typography><strong>라인:</strong> {selectedLine?.displayname}</Typography>
        <Typography><strong>LOT 번호:</strong> {selectedLot?.lotno}</Typography>
        <Typography><strong>품목명:</strong> {selectedLot?.partname}</Typography>
        <Typography><strong>지시 수량:</strong> {selectedLot?.unit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Typography>
      </Box>

      <Box my={4} textAlign="center">
        <TextField
          label="생산량 입력"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          variant="outlined"
        />
      </Box>

      <Box textAlign="center">
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          제출
        </Button>
        
      </Box>
      {/* 뒤로가기 버튼 */}
            <Box textAlign="center" mt={5}>
              <Button
                variant="contained"
                onClick={() => navigate(-1)}
                sx={{ backgroundColor: 'lightgrey', color: 'black' }}
              >
                뒤로가기
              </Button>
            </Box>
    </Box>
  );
};

export default EnterProduction;
