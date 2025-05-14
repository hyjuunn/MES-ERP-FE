import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, Button, CircularProgress, 
  Grid, Divider, Chip
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Modal3 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { fromDate, toDate } = location.state || {};

  const [workerData, setWorkerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkerData = async () => {
      if (!fromDate || !toDate) return;

      setLoading(true);
      setError(null);

      try {
        const startDate = new Date(fromDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);

        const response = await axios.get('https://mes-erp.onrender.com/getWorkerByDateRange', {
          params: {
            fromDate: startDate.toISOString(),
            toDate: endDate.toISOString()
          }
        });
        setWorkerData(response.data);
      } catch (err) {
        console.error('Error fetching worker data:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [fromDate, toDate]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toISOString().replace('T', ' ').substring(0, 19);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>
        작업자 정보 상세 조회 결과
      </Typography>

      <Typography variant="h5" sx={{ mb: 2 }}>
        <strong>조회 날짜 범위:</strong> {formatDate(fromDate)} ~ {formatDate(toDate)}
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && workerData.length > 0 ? (
        workerData.map((worker, index) => (
          <Paper key={index} elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {worker.workername}
              </Typography>
              <Chip 
                label={`작업자 ID: ${worker.workerid}`} 
                color="primary" 
                variant="outlined" 
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <DetailItem label="회사명" value={worker.companyname} />
                <DetailItem label="자원구분" value={worker.resourcetypename} />
                <DetailItem label="성별" value={worker.sex} />
                <DetailItem label="부서/소속" value={worker.departmentname} />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem label="소속유형" value={worker.departmenttype} />
                <DetailItem label="입사일" value={formatDate(worker.hireddate)} />
                <DetailItem label="직급/직책" value={worker.grade} />
                <DetailItem label="경력수준" value={worker.grade2} />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem label="회사번호" value={worker.companyno} />
                <DetailItem label="공장번호" value={worker.plantno} />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem label="공장명" value={worker.plantname} />
              </Grid>
            </Grid>
          </Paper>
        ))
      ) : (
        !loading && !error && (
          <Typography variant="body1" color="text.secondary">
            해당 기간에 맞는 작업자 정보가 없습니다.
          </Typography>
        )
      )}

      <Box sx={{ textAlign: 'center', mt: 3 }}>
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

const DetailItem = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
      {value || '-'}
    </Typography>
  </Box>
);

export default Modal3;
