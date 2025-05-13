import React, { useState } from 'react';
import { Box, Typography, Grid, Button, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SixthPage = () => {
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

  const [openDialog, setOpenDialog] = useState(false);
  const [completedItems, setCompletedItems] = useState([]);

  // 팝업 열기
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // 팝업 닫기
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 공정 준비 완료 처리
  const handleConfirmClose = async () => {
    try {
      // 1. equipmentjobhistory에 기록 추가
      const historyResponse = await axios.post('http://localhost:3000/insertEquipmentJobHistory', {
        equipment_id: selectedLot?.id || 1, // 선택된 라인 ID 사용 (없으면 기본값 1)
        event_type: 'work', // 작업 시작이므로 'work'
        product_id: selectedLot?.partno, // 제품 ID
        work_order: selectedLot?.orderno, // 작업 지시 번호
        event_time: new Date().toISOString() // 현재 시간
      });

      // 2. equipmentjob 업데이트
      const jobResponse = await axios.post('http://localhost:3000/updateEquipmentJob', {
        equipment_id: selectedLot?.id || 1,
        event_type: 'work',
        product_id: selectedLot?.partno,
        work_order: selectedLot?.orderno,
        event_time: new Date().toISOString()
      });

      // 3. productionorderset 상태 업데이트 (기존 기능 유지)
      const statusResponse = await axios.post('http://localhost:3000/updateStatus', {
        orderno: selectedLot.orderno,
        status: '진행',
      });

      if (historyResponse.status === 200 && jobResponse.status === 200 && statusResponse.status === 200) {
        alert('작업이 성공적으로 시작되었습니다.');
        navigate('/공정준비완료', {
          state: {
            username,
            plantNumber,
            selectedProcess,
            selectedCode,
            selectedLine,
            selectedLot
          }
        });
      } else {
        alert('서버 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('작업 시작 실패', error);
      alert('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    }
    setOpenDialog(false);
  };

  // 완료 버튼 토글
  const toggleComplete = (index) => {
    if (completedItems.includes(index)) {
      setCompletedItems(completedItems.filter(item => item !== index));
    } else {
      setCompletedItems([...completedItems, index]);
    }
  };

  // 체크리스트 항목 (7개)
  const checklistItems = [
    "충진물 Bulk 준비/상태 확인",
    "충진/코팅 부자재 투입 체크",
    "작업배치 체크",
    "설비운전 체크",
    "세척상태 체크",
    "시운전 체크",
    "포장부자재 체크"
  ];

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

      <Typography variant="h6" gutterBottom>
        ● 작업준비 체크 (작업준비 체크가 완료되지 않으면 공정을 시작할 수 없습니다)
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

      {/* 기능 버튼 + 왼쪽 체크리스트 구조 */}
      <Box display="flex" justifyContent="space-between" mt={4}>
        {/* 왼쪽 체크리스트 박스 */}
        <Box
            flex={1}
            minHeight="200px"
            mr={2}
            p={2}
            border="1px solid #ccc"
            borderRadius={2}
            bgcolor="#f9f9f9"
        >
          {/* 체크리스트 항목들 (7개) */}
          {checklistItems.map((item, index) => (
            <Box key={index} display="flex" mb={1}>
              {/* 내용 버튼 */}
              <Button
                variant="contained"
                sx={{
                  flex: 2,
                  fontSize: '23px',
                  backgroundColor: index === checklistItems.length - 1 ? '#e0e0e0' : '#424242',
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                  height: '40px',
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  paddingLeft: '10px',
                  '&:hover': {
                    backgroundColor: index === checklistItems.length - 1 ? '#e0e0e0' : '#424242'
                  }
                }}
                onClick={() => {
                if (index === 3) {
                    // 설비운전 체크일 경우 페이지 이동
                    navigate('/checkItemList', {
                    state: {
                        username,
                        plantNumber,
                        selectedProcess,
                        selectedCode,
                        selectedLine,
                        selectedLot
                    }
                    });
                }
                }}
              >
                {item}
              </Button>
              
              {/* 이상 버튼 */}
              <Button
                variant="contained"
                sx={{
                  fontSize: '27px',
                  flex: 1,
                  backgroundColor: '#ff5252',
                  color: 'white',
                  height: '40px',
                  borderRadius: 0,
                  minWidth: '60px',
                  '&:hover': {
                    backgroundColor: '#ff0000'
                  }
                }}
              >
                이상
              </Button>
              
              {/* 완료 버튼 */}
              <Button
                variant="contained"
                onClick={() => toggleComplete(index)}
                sx={{
                  fontSize: '27px',
                  flex: 1,
                  backgroundColor: completedItems.includes(index) ? '#4db6ac' : '#9e9e9e',
                  color: 'white',
                  height: '40px',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  minWidth: '60px',
                  '&:hover': {
                    backgroundColor: completedItems.includes(index) ? '#26a69a' : '#757575'
                  }
                }}
              >
                완료
              </Button>
            </Box>
          ))}
        </Box>

        {/* 오른쪽 버튼들 */}
        <Box display="flex" flexDirection="column" gap={1} width="200px">
            <Button 
                variant="contained" 
                color="inherit" 
                fullWidth 
                onClick={() =>
                    navigate('/currentInventory', {
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
                sx={{backgroundColor: '#fff176', height:'100px', fontSize:'20px'}}
            >
            가용재고보기
            </Button>
            <Button 
                variant="contained" 
                color="inherit" 
                fullWidth 
                sx={{ py: 2, fontSize: '1.1rem' }}
                onClick={() =>
                  navigate('/이상보고', {
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
            이상보고
            </Button>
            <Button 
                variant="contained" 
                color="success" 
                fullWidth 
                sx={{ py: 6, fontSize: '1.1rem' }}
                onClick={handleOpenDialog}
                disabled={completedItems.length !== 7} // 모든 체크리스트 완료해야 활성화
            >
            공정 준비 완료
            </Button>
        </Box>
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

      {/* 공정 준비 완료 확인 다이얼로그 */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>준비 (Time Stamp)가 완료되었습니까?</DialogTitle>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Button 
            onClick={handleConfirmClose}
            sx={{ 
              backgroundColor: 'green', 
              color: 'white', 
              border: '2px solid green', 
              width: '45%', 
              '&:hover': {
                backgroundColor: 'darkgreen'
              }
            }}
          >
            시작
          </Button>
          <Button 
            onClick={handleCloseDialog} 
            color="primary"
            sx={{ 
              backgroundColor: 'white', 
              color: 'black', 
              border: '2px solid green', 
              width: '45%', 
              '&:hover': {
                backgroundColor: 'lightgrey'
              }
            }}
          >
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SixthPage;