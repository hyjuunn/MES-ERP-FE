import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'checkedItems';

const CheckItemList = () => {
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState([]);

  // 컴포넌트 마운트 시 localStorage에서 상태 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
  }, []);

  // 체크 상태 토글
  const toggleCheck = (id) => {
    let updated;
    if (checkedItems.includes(id)) {
      updated = checkedItems.filter(item => item !== id);
    } else {
      updated = [...checkedItems, id];
    }
    setCheckedItems(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const checkItems = [
    { id: 1, line: '라인1', equipment: 'equip-01', category: '', item: '설비 점검항목입니다.' },
    { id: 2, line: '라인1', equipment: 'equip-02', category: '', item: '설비 점검항목입니다.' },
    { id: 3, line: '라인1', equipment: 'equip-03', category: '', item: '설비 점검항목입니다.' },
    { id: 4, line: '라인2', equipment: 'equip-04', category: '', item: '설비 점검항목입니다.' },
    { id: 5, line: '라인2', equipment: 'equip-05', category: '', item: '설비 점검항목입니다.' },
    { id: 6, line: '라인2', equipment: 'equip-06', category: '', item: '설비 점검항목입니다.' }
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" align="center" gutterBottom>
        설비운전 점검 항목
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3, mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', border: '1px solid #e0e0e0' }}>순번</TableCell>
                <TableCell sx={{ fontWeight: 'bold', border: '1px solid #e0e0e0' }}>라인</TableCell>
                <TableCell sx={{ fontWeight: 'bold', border: '1px solid #e0e0e0' }}>설비명</TableCell>
                <TableCell sx={{ fontWeight: 'bold', border: '1px solid #e0e0e0' }}>구분</TableCell>
                <TableCell sx={{ fontWeight: 'bold', border: '1px solid #e0e0e0' }}>점검항목</TableCell>
                <TableCell sx={{ fontWeight: 'bold', border: '1px solid #e0e0e0' }}>체크</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checkItems.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ border: '1px solid #e0e0e0' }}>{row.id}</TableCell>
                <TableCell sx={{ border: '1px solid #e0e0e0' }}>{row.line}</TableCell>
                <TableCell sx={{ border: '1px solid #e0e0e0' }}>{row.equipment}</TableCell>
                <TableCell sx={{ border: '1px solid #e0e0e0' }}>{row.category}</TableCell>
                <TableCell sx={{ border: '1px solid #e0e0e0' }}>{row.item}</TableCell>
                <TableCell sx={{ border: '1px solid #e0e0e0' }}>
                  <Button
                    variant="contained"
                    onClick={() => toggleCheck(row.id)}
                    sx={{
                      minWidth: '30px',
                      minHeight: '30px',
                      p: 0,
                      backgroundColor: checkedItems.includes(row.id) ? '#4caf50' : '#e0e0e0',
                      '&:hover': {
                        backgroundColor: checkedItems.includes(row.id) ? '#388e3c' : '#bdbdbd'
                      }
                    }}
                  >
                    {checkedItems.includes(row.id) ? '✓' : ''}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: '#9e9e9e',
            color: 'white',
            width: '120px',
            height: '50px',
            fontSize: '1.1rem',
            '&:hover': {
              backgroundColor: '#757575'
            }
          }}
        >
          이전
        </Button>
        <Button
          variant="contained"
          onClick={() => alert('점검 항목이 저장되었습니다.')}
          sx={{
            backgroundColor: '#4caf50',
            color: 'white',
            width: '120px',
            height: '50px',
            fontSize: '1.1rem',
            '&:hover': {
              backgroundColor: '#388e3c'
            }
          }}
        >
          점검 저장
        </Button>
      </Box>
    </Box>
  );
};

export default CheckItemList;
