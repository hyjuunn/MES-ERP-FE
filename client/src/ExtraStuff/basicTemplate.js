import React from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const WorkLogReg = () => {
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

      <Box mt={4} textAlign="center">
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

export default WorkLogReg;
