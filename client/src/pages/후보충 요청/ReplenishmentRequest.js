import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const ReplenishmentRequest = () => {
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

  const tableRows = Array.from({ length: 6 }, () => ({
    partno: '',
    partname: '',
    available: '',
    requestQty: ''
  }));

  return (
    <Box p={2}>
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

      {/* 자재 내역 */}
      <Box mt={6}>
        <Typography variant="h6" gutterBottom>
          ● 자재 내역 별 가용재고 현황
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ border: '1px solid #ccc', backgroundColor: '#f0f0f0', fontWeight: 'bold'}}
                >
                  품번
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: '1px solid #ccc', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
                >
                  품명
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: '1px solid #ccc', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
                >
                  가용 재고량
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: '1px solid #ccc', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
                >
                  후보충 수량
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{row.partno}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{row.partname}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{row.available}</TableCell>
                  <TableCell sx={{ border: '1px solid #ccc' }}>{row.requestQty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 버튼 영역 */}
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ backgroundColor: 'lightgrey', color: 'black', padding: '12px 24px', fontSize: '1rem', minWidth: '120px', height: '60px' }}
        >
          이전
        </Button>
        <Button 
          variant="contained" 
          sx={{ backgroundColor: 'green', color: 'white', padding: '12px 24px', fontSize: '1rem', minWidth: '120px', height: '60px'}}
        >
          후보충 요청
        </Button>
      </Box>
    </Box>
  );
};

export default ReplenishmentRequest;
