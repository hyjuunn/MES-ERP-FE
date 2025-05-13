import React, { useEffect, useState } from 'react';
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
  TableRow,
  CircularProgress
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReplenishmentRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    username,
    plantNumber,
    selectedProcess,
    selectedCode,
    selectedLine,
    selectedLot
  } = location.state || {};

  useEffect(() => {
    // currentinventory 데이터 불러오기
    axios.get('http://localhost:3000/getCurrentInventory')  // 서버의 실제 API 엔드포인트에 맞게 수정
      .then((response) => {
        setInventoryData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("데이터 불러오기 오류:", error);
        setLoading(false);
      });
  }, []);

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
                  위치 유형
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: '1px solid #ccc', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
                >
                  회사 번호
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: '1px solid #ccc', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
                >
                  회사 이름
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: '1px solid #ccc', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
                >
                  공장 번호
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: '1px solid #ccc', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
                >
                  공장 이름
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
                  마지막 업데이트
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                inventoryData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.partno}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.partname}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.locationtype}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.companyno}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.companyname}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.plantno}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.plantname}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{row.quantity}</TableCell>
                    <TableCell sx={{ border: '1px solid #ccc' }}>{new Date(row.lastupdated).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
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
      </Box>
    </Box>
  );
};

export default ReplenishmentRequest;
