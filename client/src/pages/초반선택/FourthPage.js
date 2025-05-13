import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Card, CardContent, Typography, Grid } from '@mui/material';

const statusColors = {
  전체: '#ccc',
  대기: '#FFD700',
  진행: '#4CAF50',
  완료: '#2196F3',
  지연: '#F44336',
};

const statusList = ['전체', '대기', '진행', '지연'];

export default function FourthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { username, plantNumber, selectedProcess, selectedCode, selectedLine } = location.state || {};

  const [lotData, setLotData] = useState([]);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    fetchLotData();
  }, []);

  const fetchLotData = async () => {
    try {
      // productionorderset 데이터 가져오기
      const productionResponse = await axios.get('http://localhost:3000/getProductionOrderSet');
      const productionData = productionResponse.data;

      // equipmentjob 데이터 가져오기 (최신 상태 정보)
      const equipmentResponse = await axios.get('http://localhost:3000/getEquipmentJob');
      const equipmentData = equipmentResponse.data;

      // 두 데이터를 product_id 기준으로 매핑
      const mergedData = productionData.map(lot => {
        const equipmentInfo = equipmentData.find(item => item.product_id === lot.partno);
        let status = '대기'; // 기본값
        
        if (equipmentInfo) {
          switch(equipmentInfo.event_type) {
            case 'warmStart':
              status = '대기';
              break;
            case 'work':
              status = '진행';
              break;
            case 'stop':
              status = '지연';
              break;
            default:
              status = '대기';
          }
        }
        
        return {
          ...lot,
          status,
          event_time: equipmentInfo?.event_time || null
        };
      });

      setLotData(mergedData);

      // 상태별 카운트 계산
      const countByStatus = mergedData.reduce((acc, item) => {
        const status = item.status || '대기';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      countByStatus['전체'] = mergedData.length;
      setCounts(countByStatus);
    } catch (error) {
      console.error('Error fetching lot data:', error);
    }
  };

  const handleLotClick = (lot) => {
    if (lot.status === '진행') {
      navigate('/fifth', { 
        state: { 
          selectedLot: lot, 
          username, 
          plantNumber, 
          selectedProcess, 
          selectedCode, 
          selectedLine 
        } 
      });
    } else if (['대기', '지연'].includes(lot.status)) {
      navigate('/sixth', { 
        state: { 
          selectedLot: lot, 
          username, 
          plantNumber, 
          selectedProcess, 
          selectedCode, 
          selectedLine 
        } 
      });
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        환영합니다, {username}님
      </Typography>

      <Box mt={3} mb={5} textAlign="center">
        <Typography><strong>공장 번호:</strong> {plantNumber}</Typography>
        <Typography><strong>선택된 공정:</strong> {selectedProcess?.displayname || '없음'}</Typography>
        <Typography><strong>선택된 작업장:</strong> {selectedCode?.displayname || '없음'}</Typography>
        <Typography><strong>선택된 라인:</strong> {selectedLine?.displayname || '없음'}</Typography>
      </Box>

      {/* 생산지시 관리 (LOT) */}
      <Box>
        <Typography variant="h5" gutterBottom>
          ● 생산지시 관리 (LOT)
        </Typography>

        {/* 상태별 요약 버튼 */}
        <Grid container spacing={2} justifyContent="center" mb={3}>
          {statusList.map((status) => (
            <Grid item key={status}>
              <Button
                onClick={() => navigate('/statusPage', { state: { selectedStatus: status, username, plantNumber, selectedProcess, selectedCode, selectedLine } })}
                sx={{
                  backgroundColor: statusColors[status],
                  color: 'white',
                  width: 200,
                  height: 80,
                  textAlign: 'center',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: statusColors[status],
                    opacity: 0.8,
                  },
                }}
              >
                <Box>
                  <Typography variant="body2">{status}</Typography>
                  <Typography variant="h6">{counts[status] || 0} 건</Typography>
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* LOT 리스트 */}
        <Box>
          {lotData.map((lot, index) => (
            <Box key={index} mb={2}>
              <Card variant="outlined">
                <Box display="flex">
                  {/* 상태 버튼 */}
                  <Button
                    onClick={() => handleLotClick(lot)}
                    sx={{
                      width: 120,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: statusColors[lot.status] || '#999',
                      color: 'white',
                      borderRadius: 0,
                      '&:hover': {
                        backgroundColor: statusColors[lot.status] || '#999',
                        opacity: 0.8,
                      },
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      {lot.status || '대기'}
                    </Typography>
                  </Button>
                  
                  {/* 상세 정보 */}
                  <Button
                    onClick={() => handleLotClick(lot)}
                    sx={{
                      flexGrow: 1,
                      textAlign: 'left',
                      justifyContent: 'flex-start',
                      color: 'inherit',
                      padding: 2,
                      borderRadius: 0,
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <Box>
                      <Typography>LOT 번호: {lot.lotno}</Typography>
                      <Typography>작업지시번호: {lot.orderno}</Typography>
                      <Typography>계획시작일시: {lot.planneddate}</Typography>
                      <Typography>품목명: {lot.partname}</Typography>
                      <Typography>품목코드: {lot.partno}</Typography>
                      {lot.event_time && (
                        <Typography>최근 상태 업데이트: {new Date(lot.event_time).toLocaleString()}</Typography>
                      )}
                    </Box>
                  </Button>
                </Box>
              </Card>
            </Box>
          ))}
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
    </div>
  );
}