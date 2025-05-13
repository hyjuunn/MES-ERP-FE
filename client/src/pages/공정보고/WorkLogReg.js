import React from 'react';
import { Box, Typography, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
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

  const additionalItems = [
    '작업자 수',
    '원불량',
    '사파불량 (완제품)',
    '관리품 불출 수량',
    '검체 수량',
    '사파불량 (자재)'
  ];

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

      {/* LOT 정보 */}
      <Box borderRadius={2} mb={4}>
        <Typography variant="h6" gutterBottom>
            <strong>
                ● 작업일지 입력
            </strong>
        </Typography>
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

      {/* 좌우 분할 레이아웃 */}
      <Box display="flex" gap={2} width="100%">
        {/* 왼쪽: 항목 6개 + 원부자재 잔류 내역 테이블 */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
        >
          {/* 6 items in 2 rows of 3 */}
          <Grid container spacing={2} mb={2}>
            {additionalItems.map((label, idx) => (
              <Grid item xs={12} sm={4} key={idx}>
                <Box display="flex" flexDirection="column" height="100%">
                  <Box
                    bgcolor="#e0e0e0"
                    height="50px"
                    width="20vw"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderTopLeftRadius={8}
                    borderTopRightRadius={8}
                  >
                    <Typography fontWeight="bold" textAlign="center">
                      {label}
                    </Typography>
                  </Box>
                  <Box
                    bgcolor="#fff"
                    flexGrow={1}
                    height="50px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    border="1px solid #ccc"
                    borderTop="none"
                    borderBottomLeftRadius={8}
                    borderBottomRightRadius={8}
                  >
                    <Typography>-</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* 원부자재 잔류 내역 테이블 */}
          <Box mt={2} flex={1}>
            <Typography variant="h6" gutterBottom>
                <strong>● 원부자재 잔류 내역</strong>
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#d3d3d3', border: '1px solid #000' }}>품번</TableCell>
                    <TableCell sx={{ backgroundColor: '#d3d3d3', border: '1px solid #000' }}>품명</TableCell>
                    <TableCell sx={{ backgroundColor: '#d3d3d3', border: '1px solid #000' }}>가용 재고량</TableCell>
                    <TableCell sx={{ backgroundColor: '#d3d3d3', border: '1px solid #000' }}>잔류량</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(3)].map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ border: '1px solid #ccc' }}>-</TableCell>
                      <TableCell sx={{ border: '1px solid #ccc' }}>-</TableCell>
                      <TableCell sx={{ border: '1px solid #ccc' }}>-</TableCell>
                      <TableCell sx={{ border: '1px solid #ccc' }}>-</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        {/* 오른쪽: 고정 마감 요청 버튼 */}
        <Box
          width="250px"
          minWidth="100px"
          display="flex"
          flexDirection="column"
        >
          <Button
            variant="contained"
            color="success"
            sx={{
              width: '100%',
              height: '100%',  // Match the height of the left content
              minHeight: '300px',  // Set a minimum height
              fontWeight: 'bold',
              fontSize: '30px'
            }}
          >
            마감 요청
          </Button>
        </Box>
      </Box>

      {/* 뒤로가기 버튼 */}
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
