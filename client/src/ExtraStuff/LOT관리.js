import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

const statusColors = {
  전체: '#ccc',
  대기: '#FFD700',
  진행: '#4CAF50',
  완료: '#2196F3',
  지연: '#F44336',
};

export default function LotManager() {
  const [lotData, setLotData] = useState([]);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    fetchLotData();
  }, []);

  const fetchLotData = async () => {
    try {
      const response = await axios.get('http://192.168.0.15:3000/getProductionOrderSet');
      const data = response.data;
      setLotData(data);

      const countByStatus = data.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});
      setCounts(countByStatus);
    } catch (error) {
      console.error('Error fetching lot data:', error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        LOT 관리(POP)
      </Typography>

      {/* 상태별 카운트 박스 */}
      <Grid container spacing={2} mb={3}>
        {['전체', '대기', '진행', '완료', '지연'].map((status) => (
          <Grid item key={status}>
            <Card sx={{ backgroundColor: statusColors[status], color: 'white', width: 200, textAlign: 'left' }}>
              <CardContent>
                <Typography variant="body2">{status}</Typography>
                <Typography variant="h6">{status === '전체' ? lotData.length : counts[status] || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* LOT 리스트 카드 */}
      <Grid container spacing={2}>
        {lotData.map((lot, index) => (
          <Grid item xs={12} key={index}>
            <Card variant="outlined">
              <Box display="flex">
                {/* 왼쪽 상태 박스 */}
                <Box
                  width={700}
                  minWidth={100}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ backgroundColor: statusColors[lot.status], color: 'white' }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    {lot.status}
                  </Typography>
                </Box>

                {/* 나머지 정보 */}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography>LOT 번호: 123456789012345</Typography>
                  <Typography>작업지시번호: {lot.orderno}</Typography>
                  <Typography>계획시작일시: {lot.planneddate}</Typography>
                  <Typography>품목명: {lot.partname}</Typography>
                  <Typography>품목코드: {lot.partno}</Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

    </Box>
  );
}
