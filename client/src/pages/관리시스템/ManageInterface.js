import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button,
  Paper, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const InterfaceManagement = () => {
  const navigate = useNavigate();
  
  // 품목정보 상태
  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  
  // 업체정보 상태
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // 인적자원 상태
  const [hrFromDate, setHrFromDate] = useState('');
  const [hrToDate, setHrToDate] = useState('');

  const handleItemSearch = () => {
    navigate('/modal1', {
      state: {
        partno: itemCode,
        partname: itemName
      }
    });
  };

  const handleVendorSearch = () => {
    if (!fromDate || !toDate) {
      alert('날짜를 입력해주세요.');
      return;
    }
    navigate('/modal2', {
      state: {
        type: 'vendor',
        fromDate,
        toDate
      }
    });
  };

  const handleHRSearch = () => {
    if (!hrFromDate || !hrToDate) {
      alert('날짜를 입력해주세요.');
      return;
    }
    navigate('/modal3', {
      state: {
        type: 'hr',
        fromDate: hrFromDate,
        toDate: hrToDate
      }
    });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>
        인터페이스 관리
      </Typography>

      {/* 1. 품목정보 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          1_품목정보(완제품, 반제품, 원부자재) 하위 BOM
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="body1">1. 품번:</Typography>
          <TextField
            size="small"
            placeholder="품번 입력"
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
            sx={{ width: 200 }}
          />
          <Typography variant="body1">품명:</Typography>
          <TextField
            size="small"
            placeholder="품명 입력"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ width: 200 }}
          />
          <Button variant="contained" onClick={handleItemSearch} sx={{ ml: 2 }}>
            조회
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          품번, 품목 보내면 관련된 하위 BOM 전부 회신 (아규먼트 2개는 AND가 아니라 :: OR 임)
        </Typography>
      </Paper>

      {/* 2. 업체정보 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          2_업체정보
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="body1">2. FROM:</Typography>
          <TextField
            size="small"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            sx={{ width: 200 }}
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="body1">TO:</Typography>
          <TextField
            size="small"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            sx={{ width: 200 }}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" color="primary" onClick={handleVendorSearch} sx={{ ml: 2 }}>
            조회
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          아규먼트. 일자 FROM-TO 보내면 (등록 + 수정) 해당세트 회신
        </Typography>
      </Paper>

      {/* 3. 인적자원 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          3_인적자원 (현장조직 및 인원관리)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="body1">3. FROM:</Typography>
          <TextField
            size="small"
            type="date"
            value={hrFromDate}
            onChange={(e) => setHrFromDate(e.target.value)}
            sx={{ width: 200 }}
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="body1">TO:</Typography>
          <TextField
            size="small"
            type="date"
            value={hrToDate}
            onChange={(e) => setHrToDate(e.target.value)}
            sx={{ width: 200 }}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" color="primary" onClick={handleHRSearch} sx={{ ml: 2 }}>
            조회
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          아규먼트. 일자 FROM-TO 보내면 (등록+수정) 해당세트 회신
        </Typography>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/admin')}
          sx={{ backgroundColor: 'lightgrey', color: 'black' }}
        >
          뒤로가기
        </Button>
      </Box>
    </Box>
  );
};

export default InterfaceManagement;
