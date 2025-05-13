import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const ReasonForDeficiency = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    username,
    plantNumber,
    selectedProcess,
    selectedCode,
    selectedLine,
    selectedLot,
    matchedData
  } = location.state || {};

  return (
    <Box p={4}>
      <Typography variant="h4" align="center" gutterBottom>
        환영합니다, {username}님
      </Typography>

      {/* 선택 정보 요약 */}
      <Box mt={3} mb={5} textAlign="center">
        <Typography><strong>공장 번호:</strong> {plantNumber}</Typography>
        <Typography><strong>선택된 공정:</strong> {selectedProcess?.displayname || '없음'}</Typography>
        <Typography><strong>선택된 작업장:</strong> {selectedCode?.displayname || '없음'}</Typography>
        <Typography><strong>선택된 라인:</strong> {selectedLine?.displayname || '없음'}</Typography>
      </Box>


      {/* LOT 정보 */}
      <Box borderRadius={2} mb={4}>
        <Typography variant="h6" gutterBottom>
        <strong>
            ● 생산 누적 과부족 입력
        </strong>
        </Typography>
        <Grid container spacing={1} alignItems="stretch">
          {[
            { label: 'LOT 번호', value: selectedLot?.lotno || '-' },
            { label: '품번', value: selectedLot?.partno || '-' },
            { label: '품목명', value: selectedLot?.partname || '-' },
          ].map((item, idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Box display="flex">
                <Box
                  bgcolor="#e0e0e0"
                  px={1.5}
                  py={1}
                  width="12vw"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderTopLeftRadius={8}
                  borderBottomLeftRadius={8}
                >
                  <Typography fontWeight="bold">{item.label}</Typography>
                </Box>
                <Box
                  bgcolor="#fff"
                  px={2}
                  py={1}
                  width="16vw"
                  border="1px solid #ccc"
                  borderLeft="none"
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                  borderTopRightRadius={8}
                  borderBottomRightRadius={8}
                >
                  <Typography>{item.value}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 사유 버튼 */}
      <Box mt={6} display="flex" flexDirection="column" gap={2}>
        <Button variant="contained" sx={{ height: '5vw', fontSize: '20px', backgroundColor: 'lightgrey', color: 'black'}}>
            <Typography fontSize='30px'><strong>내용물 소진 (반제품 소진)</strong></Typography>
        </Button>
        <Button variant="contained" color="primary" sx={{ height: '5vw', backgroundColor: 'lightgrey', color: 'black'}}>
            <Typography fontSize='30px'><strong>부자재 소진</strong></Typography>
        </Button>
        <Button variant="contained" color="primary" sx={{ height: '5vw', fontSize: '20px', backgroundColor: 'lightgrey', color: 'black'}}>
          <Typography fontSize='30px'><strong>원불량 과다</strong></Typography>
        </Button>
        <Button variant="contained" color="primary" sx={{ height: '5vw', fontSize: '20px', backgroundColor: 'lightgrey', color: 'black'}}>
          <Typography fontSize='30px'><strong>공정불량 과다</strong></Typography>
        </Button>
      </Box>

      {/* 취소 버튼 */}
      <Box mt={4}>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ height: '4vw', width: '10vw', fontSize: '20px', backgroundColor: 'lightgrey', color: 'black' }}
        >
          이전
        </Button>
      </Box>
    </Box>
  );
};

export default ReasonForDeficiency;
