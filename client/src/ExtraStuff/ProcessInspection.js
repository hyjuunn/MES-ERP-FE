import React, { useState } from 'react';
import { 
  Box, Typography, Button, 
  Table, TableBody, TableCell, TableRow, 
  TextField, Paper, TableContainer
} from '@mui/material';

const ProcessInspectionPage = ({
  lotNumber = 'LOT2025020723',
  productCode = '5923s1236964d3',
  productName = 'Slushy Serum Moisturizer Crush Infused with Bakuchiol'
}) => {
  const [inspectionData, setInspectionData] = useState({
    inspection1: '',
    inspection2: '100',
    inspection3: '100',
    inspection4: '9',
    inspection5: '10',
    inspection6: '',
    memo: ''
  });

  const handleChange = (field) => (e) => {
    setInspectionData({ ...inspectionData, [field]: e.target.value });
  };

  return (
    <Box p={3} sx={{ maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        iMINE POP
      </Typography>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        공정작업일자 - 검사일지 입력
      </Typography>

      {/* 기본 정보 테이블 */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ width: 150, fontWeight: 'bold' }}>LOT 번호</TableCell>
              <TableCell>{lotNumber}</TableCell>
              <TableCell sx={{ width: 150, fontWeight: 'bold' }}>품번</TableCell>
              <TableCell>{productCode}</TableCell>
              <TableCell sx={{ width: 150, fontWeight: 'bold' }}>품목명</TableCell>
              <TableCell>{productName}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* 검사 입력 테이블 */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableBody>
            {/* 1행 */}
            <TableRow>
              <TableCell sx={{ width: 150, fontWeight: 'bold' }}>검사 1</TableCell>
              <TableCell>
                <TextField
                  value={inspectionData.inspection1}
                  onChange={handleChange('inspection1')}
                  size="small"
                  sx={{ width: 80 }}
                />
              </TableCell>
              <TableCell sx={{ width: 150, fontWeight: 'bold' }}>검사 2</TableCell>
              <TableCell>
                <TextField
                  value={inspectionData.inspection2}
                  onChange={handleChange('inspection2')}
                  size="small"
                  sx={{ width: 80 }}
                />
              </TableCell>
              <TableCell sx={{ width: 150, fontWeight: 'bold' }}>검사 3</TableCell>
              <TableCell>
                <TextField
                  value={inspectionData.inspection3}
                  onChange={handleChange('inspection3')}
                  size="small"
                  sx={{ width: 80 }}
                />
              </TableCell>
              <TableCell rowSpan={2}>
                <Button 
                  variant="contained" 
                  color="error"
                  sx={{ height: '100%', minHeight: 80 }}
                  onClick={() => window.history.back()}
                >
                  뒤로가기 (미저장)
                </Button>
              </TableCell>
            </TableRow>
            
            {/* 2행 */}
            <TableRow>
              <TableCell></TableCell>
              <TableCell>{inspectionData.inspection4}</TableCell>
              <TableCell></TableCell>
              <TableCell>{inspectionData.inspection5}</TableCell>
              <TableCell></TableCell>
              <TableCell>{inspectionData.inspection6 || '-'}</TableCell>
            </TableRow>

            {/* 3행 */}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>검사 4</TableCell>
              <TableCell colSpan={5}>
                <TextField
                  value={inspectionData.inspection4}
                  onChange={handleChange('inspection4')}
                  size="small"
                  sx={{ width: 80 }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* 메모 입력 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          메모
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={inspectionData.memo}
          onChange={handleChange('memo')}
          variant="outlined"
        />
      </Box>

      {/* 확인 버튼 */}
      <Box display="flex" justifyContent="flex-end">
        <Button 
          variant="contained" 
          color="primary"
          sx={{ width: 150, height: 50 }}
          onClick={() => alert('저장되었습니다')}
        >
          확인 (저장)
        </Button>
      </Box>
    </Box>
  );
};

export default ProcessInspectionPage;