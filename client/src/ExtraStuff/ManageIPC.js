import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableRow, Paper, TableContainer} from '@mui/material';

const IPCPage = ({ 
  orderNumber = '2025020712345678',
  lotNumber = 'LOT20250207123',
  startDate = '2025-02-07 13:02:59',
  clientName = '',
  productCode = '5923512369643d3',
  productName = 'Slushy Serum Moisturizer Crush Infused with Bakuchiol'
}) => {
  const [checks, setChecks] = useState({
    standard: Array(5).fill(false),
    material: Array(5).fill(false),
    sensory: Array(5).fill(false),
    content: Array(5).fill(false),
    foreign: Array(5).fill(false),
    pressure: Array(5).fill(false),
    count: Array(5).fill(false),
    stamp: Array(5).fill(false)
  });

  const toggleCheck = (category, index) => {
    setChecks(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) => 
        i === index ? !item : item
      )
    }));
  };

  const getCheckCount = (category) => {
    return checks[category].filter(Boolean).length;
  };

  return (
    <Box p={3} sx={{ maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        IMINE POP
      </Typography>
      <Typography variant="h5" align="center" gutterBottom sx={{ mb: 4 }}>
        IPC 검사
      </Typography>

      {/* 작업 정보 표시 */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" mb={1}>
          <Typography sx={{ width: 120, fontWeight: 'bold' }}>작업지시번호</Typography>
          <Typography sx={{ flex: 1 }}>{orderNumber}</Typography>
          <Typography sx={{ width: 80, fontWeight: 'bold' }}>LOT번호</Typography>
          <Typography sx={{ flex: 1 }}>{lotNumber}</Typography>
        </Box>
        <Box display="flex" mb={1}>
          <Typography sx={{ width: 120, fontWeight: 'bold' }}>시작일시</Typography>
          <Typography sx={{ flex: 1 }}>{startDate}</Typography>
          <Typography sx={{ width: 80, fontWeight: 'bold' }}>거래처명</Typography>
          <Typography sx={{ flex: 1 }}>{clientName || '-'}</Typography>
        </Box>
        <Box display="flex">
          <Typography sx={{ width: 120, fontWeight: 'bold' }}>품목코드</Typography>
          <Typography sx={{ flex: 1 }}>{productCode}</Typography>
          <Typography sx={{ width: 80, fontWeight: 'bold' }}>품목명</Typography>
          <Typography sx={{ flex: 1 }}>{productName}</Typography>
        </Box>
      </Box>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        표준품 확인 ({getCheckCount('standard')}/5)
      </Typography>

      {/* 검사 항목 테이블 */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableBody>
            {[
              { label: '자재확인', category: 'material' },
              { label: '관능점검', category: 'sensory' },
              { label: '내용량 측정', category: 'content' },
              { label: '이물체크', category: 'foreign' },
              { label: '감압 점검', category: 'pressure' },
              { label: '매입수 측정', category: 'count' },
              { label: '날인체크', category: 'stamp' }
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ width: 150, fontWeight: 'bold', borderRight: '1px solid #e0e0e0' }}>
                  {item.label}
                </TableCell>
                <TableCell>
                  <Box display="flex">
                    {checks[item.category].map((checked, i) => (
                      <Button
                        key={i}
                        variant="contained"
                        size="small"
                        onClick={() => toggleCheck(item.category, i)}
                        sx={{
                          minWidth: 30,
                          minHeight: 30,
                          mx: 0.5,
                          backgroundColor: checked ? '#4caf50' : '#e0e0e0',
                          color: checked ? 'white' : 'inherit',
                          '&:hover': {
                            backgroundColor: checked ? '#388e3c' : '#bdbdbd'
                          }
                        }}
                      >
                        {checked ? '✓' : i + 1}
                      </Button>
                    ))}
                    <Typography sx={{ ml: 2, fontWeight: 'bold' }}>
                      ({getCheckCount(item.category)}/5)
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 하단 버튼 그룹 */}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button variant="contained" sx={{ width: 120, height: 40 }}>
          출력
        </Button>
        <Button variant="contained" color="primary" sx={{ width: 120, height: 40 }}>
          저장
        </Button>
        <Button 
          variant="contained" 
          color="success" 
          sx={{ width: 120, height: 40 }}
          onClick={() => window.history.back()}
        >
          완료 (돌아가기)
        </Button>
      </Box>
    </Box>
  );
};

export default IPCPage;