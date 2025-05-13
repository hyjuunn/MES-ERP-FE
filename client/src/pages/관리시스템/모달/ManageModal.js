import React from 'react';
import { 
  Box, Typography, Button, Paper, Divider 
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const ManageModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { type, ...params } = location.state || {};

  // 샘플 데이터
  const sampleData = {
    callNumber: '20230815-001',
    callName: type === 'item' ? '품목정보 조회' : '업체정보 조회',
    callTime: '2023-08-15 10:30:25',
    responseTime: '2023-08-15 10:30:45',
    duration: '0.02초',
    responseCount: type === 'item' ? '15건' : '8건',
    args: type === 'item' 
      ? [`품번: ${params.itemCode || '-'}`, `품명: ${params.itemName || '-'}`, ''] 
      : [`FROM: ${params.fromDate || '-'}`, `TO: ${params.toDate || '-'}`, '']
  };

  const responseItems = type === 'item' 
    ? [
        { kor: '품번', eng: 'Item Code', value: 'A001' },
        { kor: '품명', eng: 'Item Name', value: '완제품 A' },
        { kor: 'BOM 레벨', eng: 'BOM Level', value: '1' },
        { kor: '하위 품목 수', eng: 'Sub Items', value: '5' }
      ]
    : [
        { kor: '업체코드', eng: 'Vendor Code', value: 'V1001' },
        { kor: '업체명', eng: 'Vendor Name', value: 'ABC 주식회사' },
        { kor: '등록일', eng: 'Reg Date', value: '2023-08-10' },
        { kor: '수정일', eng: 'Mod Date', value: '2023-08-12' }
      ];

  return (
    <Box sx={{ p: 4 }}>
      {/* 호출 정보 헤더 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle1">호출번호:</Typography>
            <Typography>{sampleData.callNumber}</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle1">호출명:</Typography>
            <Typography>{sampleData.callName}</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle1">호출시각:</Typography>
            <Typography>{sampleData.callTime}</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle1">답변시각:</Typography>
            <Typography>{sampleData.responseTime}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle1">소요시간:</Typography>
            <Typography>{sampleData.duration}</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle1">답변 건수:</Typography>
            <Typography>{sampleData.responseCount}</Typography>
          </Box>
          <Box sx={{ flex: 2, minWidth: 300 }}>
            <Typography variant="subtitle1">호출인자:</Typography>
            <Typography>{sampleData.args.join(' | ')}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* 답변 내용 테이블 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 2fr',
          gap: 1,
          mb: 1
        }}>
          <Typography variant="subtitle1" fontWeight="bold">항목명 (한글)</Typography>
          <Typography variant="subtitle1" fontWeight="bold">항목명 (영문)</Typography>
          <Typography variant="subtitle1" fontWeight="bold">답변내용</Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {responseItems.map((item, index) => (
          <Box 
            key={index}
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 2fr',
              gap: 1,
              mb: 1,
              backgroundColor: 'white',
              p: 1,
              borderBottom: '1px solid #ccc',
              borderRadius: 1
            }}
          >
            <Typography>{item.kor}</Typography>
            <Typography>{item.eng}</Typography>
            <Typography sx={{ 
              backgroundColor: 'white',
              p: 1
            }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Paper>

      {/* 닫기 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained"
          onClick={() => navigate('/manageInterface')}
          sx={{ width: 120 }}
        >
          닫기
        </Button>
      </Box>
    </Box>
  );
};

export default ManageModal;
