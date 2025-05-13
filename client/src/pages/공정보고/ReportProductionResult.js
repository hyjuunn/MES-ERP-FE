import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReportProductionResult = () => {
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

  const [productionData, setProductionData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getProduction');
        setProductionData(response.data);
      } catch (error) {
        console.error('데이터 가져오기 실패', error);
      }
    };

    if (selectedLot?.lotno) {
      fetchData();
    }
  }, [selectedLot]);

  const matchedData = productionData?.find(
    (item) => item.orderno === selectedLot?.orderno
  );

  const progress =
    matchedData && selectedLot?.unit
      ? (matchedData.amount / selectedLot.unit) * 100
      : 0;

  const handleEnterProduction = () => {
    navigate('/enterProduction', {
      state: {
        username,
        plantNumber,
        selectedProcess,
        selectedCode,
        selectedLine,
        selectedLot
      }
    });
  };

  return (
    <Box p={4}>
      <Typography variant="h4" align="center" gutterBottom>
        환영합니다, {username}님
      </Typography>

      <Box mt={3} mb={5} textAlign="center">
        <Typography><strong>공장 번호:</strong> {plantNumber}</Typography>
        <Typography><strong>선택된 공정:</strong> {selectedProcess?.displayname || '없음'}</Typography>
        <Typography><strong>선택된 작업장:</strong> {selectedCode?.displayname || '없음'}</Typography>
        <Typography><strong>선택된 라인:</strong> {selectedLine?.displayname || '없음'}</Typography>
      </Box>

      <Box borderRadius={2} mb={2}>
        <Grid container spacing={1} alignItems="stretch">
          {[
            { label: 'LOT 번호', value: selectedLot?.lotno || '-' },
            { label: '품번', value: selectedLot?.partno || '-' },
            { label: '지시수량', value: selectedLot?.unit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '-' },
            { label: '품목명', value: selectedLot?.partname || '-' }
          ].map((item, idx) => (
            <Grid item xs={12} sm={3} key={idx}>
              <Box display="flex" height="100%">
                <Box
                  bgcolor="#e0e0e0"
                  px={1.5}
                  py={1}
                  width="13vw"
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
                  width="15vw"
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

      <Box mt={4} px={2}>
        <Box position="relative" mb={1}>
          <Box position="relative" height={55} borderRadius={4} bgcolor="#e0e0e0" overflow="hidden">
            <Box
              position="absolute"
              top={0}
              left={0}
              height="100%"
              width={`${progress}%`}
              bgcolor="primary.main"
            />
          </Box>
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={0}
          >
            <Typography variant="body2" fontWeight="bold" color="white" fontSize="25px">
              생산량: {(matchedData?.amount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="black" fontSize="25px">
              부족수량: {(selectedLot?.unit - matchedData?.amount || selectedLot?.unit).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box mt={4}>
        <Box bgcolor="#e0e0e0" padding={5} borderRadius={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box textAlign="left">
            <Typography variant="h6" fontWeight="bold">
              생산량
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="h4" fontWeight="bold">
              {(matchedData?.amount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box mt={4} display="flex" justifyContent="space-between" gap={2}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleEnterProduction}
          sx={{ height: '5vw', fontSize: '30px' }}
        >
          생산 실적 입력 / 수정
        </Button>

        <Button
          variant="contained"
          fullWidth
          sx={{
            height: '5vw',
            fontSize: '30px',
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid #ccc',
            backgroundColor: 'lightgrey'
          }}
          onClick={() =>
            navigate('/reasonForDeficiency', {
                state: {
                    username,
                    plantNumber,
                    selectedProcess,
                    selectedCode,
                    selectedLine,
                    selectedLot,
                    matchedData
                }
            })
          }
        >
          과부족 사유 등록
        </Button>

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ height: '5vw', fontSize: '30px'}}
          onClick={() =>
            navigate('/workLogReg', {
              state: {
                username,
                plantNumber,
                selectedProcess,
                selectedCode,
                selectedLine,
                selectedLot,
                matchedData
              }
            })
          }
        >
          작업일지 등록
        </Button>
      </Box>

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

export default ReportProductionResult;
