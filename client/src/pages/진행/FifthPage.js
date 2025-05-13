import React, { useState } from 'react';
import { Box, Typography, Grid, Button, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const FifthPage = () => {
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

  const planQty = selectedLot?.unit ?? 0;
  const carryOverQty = selectedLot?.carryoverqty ?? 0;
  const progressQty = selectedLot?.progressqty ?? 0;
  const remainingQty = planQty - progressQty;

  const infoCards = [
    {
      title: '지시량',
      value: (planQty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      bgColor: '#a0e7e5' // 아쿠아그린
    },
    {
      title: '이월량',
      value: (carryOverQty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      bgColor: '#87ceeb' // 블루
    },
    {
      title: '진척수량 / 잔여량',
      value: `${(progressQty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} / ${(remainingQty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
      bgColor: '#fff176' // 노랑
    }
  ];

  const [openDialog, setOpenDialog] = useState(false);

  // 팝업 열기
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // 팝업 닫기
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 마감 버튼 클릭 시 페이지 이동
  const handleConfirmClose = () => {
    navigate('/reportProductionResult', {
      state: {
        username,
        plantNumber,
        selectedProcess,
        selectedCode,
        selectedLine,
        selectedLot
      }
    });
    setOpenDialog(false);
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        환영합니다, {username}님
      </Typography>
      {/* 선택된 정보 요약 */}
      <Box mt={3} mb={5} textAlign="center">
        <Typography>
          <strong>공장 번호:</strong> {plantNumber}
        </Typography>
        <Typography>
          <strong>선택된 공정:</strong> {selectedProcess?.displayname || '없음'}
        </Typography>
        <Typography>
          <strong>선택된 작업장:</strong> {selectedCode?.displayname || '없음'}
        </Typography>
        <Typography>
          <strong>선택된 라인:</strong> {selectedLine?.displayname || '없음'}
        </Typography>
      </Box>

      {/* 상단 정보 카드 */}
      <Grid container spacing={2} justifyContent="center" mb={3}>
        {infoCards.map((card, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Paper
              elevation={3}
              sx={{
                bgcolor: card.bgColor,
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
                width: '20vw'
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {card.title}
              </Typography>
              <Typography variant="h5">{card.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" gutterBottom>
        ● 생산 지시 내역
      </Typography>

        {/* 생산지시 정보 */}
        <Box borderRadius={2} mb={2}>
        <Grid container spacing={1} alignItems="stretch">
            {[
            { label: '작업지시 번호', value: selectedLot?.orderno || '-' },
            { label: 'LOT 번호', value: selectedLot?.lotno || '-' },
            { label: '시작일시', value: selectedLot?.planneddate || '-' },
            { label: '거래처명', value: selectedLot?.client || '-' },
            { label: '품번', value: selectedLot?.partno || '-' },
            { label: '품목명', value: selectedLot?.partname || '-' }
            ].map((item, idx) => (
            <React.Fragment key={idx}>
                <Grid item xs={12} sm={3}>
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
            </React.Fragment>
            ))}
        </Grid>
        </Box>
        {/* 기능 버튼 + 왼쪽 빈 테이블 구조 */}
        <Box display="flex" justifyContent="space-between" mt={4}>
        {/* 왼쪽 빈 테이블 스타일 박스 */}
        <Box
            flex={1}
            height='14vw'
            minHeight="200px"
            mr={2}
            p={2}
            border="1px solid #ccc"
            borderRadius={2}
            bgcolor="#f9f9f9"
        >
            <Typography color="textSecondary" align="center">
            {/* empty */}
            </Typography>
        </Box>

        {/* 오른쪽 버튼들 */}
        <Box display="flex" flexDirection="column" gap={1} width="200px">
            <Button variant="contained" color="inherit" fullWidth sx={{ py: 2, fontSize: '1.1rem'}}
                onClick={() =>
                    navigate('/processreport', {
                        state: {
                        username,
                        plantNumber,
                        selectedProcess,
                        selectedCode,
                        selectedLine,
                        selectedLot
                        }
                    })
                }
            >
            공정 정지 (휴식)
            </Button>
            <Button variant="contained" color="error" fullWidth sx={{ py: 2, fontSize: '1.1rem'}}>
            일탈
            </Button>
            <Button 
                variant="contained" 
                color="inherit" 
                fullWidth 
                sx={{ py: 2, fontSize: '1.1rem' }}
                onClick={() =>
                  navigate('/replenishmentRequest', {
                    state: {
                      username,
                      plantNumber,
                      selectedProcess,
                      selectedCode,
                      selectedLine,
                      selectedLot
                    }
                  })
                }
            >
            후보충 요청
            </Button>
            <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ py: 2, fontSize: '1.1rem' }}
                onClick={handleOpenDialog}
            >
            공정보고
            </Button>
        </Box>
        </Box>

      {/* 하단 버튼 */}
      <Box display="flex" justifyContent="space-between" mt={4}>
        {['작업지시서', '제품사양서', '처방전', 'SOP', '기타'].map((label) => (
          <Button key={label} variant="contained" color="inherit" fullWidth sx={{ mx: 1, py: 2}}>
            {label}
          </Button>
        ))}
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
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>공정 작업을 마감 하시겠습니까?</DialogTitle>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Button 
            onClick={handleConfirmClose}
            sx={{ backgroundColor: 'green', color: 'white', border: '2px solid green', width: '45%', '&:hover': {backgroundColor: 'darkgreen'}}}
          >
            마감
          </Button>
          <Button 
            onClick={handleCloseDialog} color="primary"
            sx={{ backgroundColor: 'white', color: 'black', border: '2px solid green', width: '45%', '&:hover': {backgroundColor: 'lightgrey'}}}
          >
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FifthPage;
