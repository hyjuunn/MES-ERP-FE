import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, Button, CircularProgress, 
  Grid, Divider, Chip, Stack
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Modal2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { fromDate, toDate } = location.state || {};
  
  const [partnerData, setPartnerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartnerData = async () => {
      if (!fromDate || !toDate) return;
  
      setLoading(true);
      setError(null);
      
      try {
        // 날짜 범위 조정 (하루 종일 범위로 설정)
        const startDate = new Date(fromDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
  
        const response = await axios.get('https://mes-erp.onrender.com/getPartnerByDateRange', {
          params: {
            fromDate: startDate.toISOString(),
            toDate: endDate.toISOString()
          }
        });
        setPartnerData(response.data);
      } catch (err) {
        console.error('Error fetching partner data:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchPartnerData();
  }, [fromDate, toDate]);

  // 필드별 한국어 라벨 매핑
  const fieldLabels = {
    partnercd: '업체 코드',
    partnername: '업체명',
    partnerbusinesscode: '사업자등록번호',
    partnerceo: '대표자',
    partnermanager: '담당자',
    partneragentmanager: '구매처 담당자',
    partnertype: '업체 유형',
    partneraddress: '주소',
    companyno: '회사 번호',
    companyname: '회사명',
    plantno: '공장 번호',
    plantname: '공장명',
    creatorname: '등록자',
    createdatetime: '등록일시',
    modifername: '수정자',
    modiferdatetime: '수정일시',
    id: 'ID'
  };

  // 날짜 형식 변환 함수
  // 날짜 표시 형식도 일관되게 변경
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24시간 형식으로 출력
    };

    return date.toISOString().replace('T', ' ').substring(0, 19); // ISO 형식 그대로 출력
  };


  
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>
        업체정보 상세 조회 결과
      </Typography>

      {/* 날짜 범위 표시 */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        <strong>조회 날짜 범위:</strong> {formatDate(fromDate)} ~ {formatDate(toDate)}
      </Typography>

      {/* 로딩 및 에러 상태 표시 */}
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

      {/* 업체 정보 표시 */}
      {!loading && partnerData.length > 0 ? (
        partnerData.map((partner, index) => (
          <Paper key={index} elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {partner.partnername}
              </Typography>
              <Chip 
                label={`업체 코드: ${partner.partnercd}`} 
                color="primary" 
                variant="outlined" 
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={6}>
              {/* 1열 */}
              <Grid item xs={12} md={6}>
                <DetailItem label="사업자등록번호" value={partner.partnerbusinesscode} />
                <DetailItem label="대표자" value={partner.partnerceo} />
                <DetailItem label="담당자" value={partner.partnermanager} />
              </Grid>
              
              <Grid item xs={12} md={6}>
              <DetailItem label="구매처 담당자" value={partner.partneragentmanager} />
                <DetailItem label="업체 유형" value={partner.partnertype} />
                <DetailItem label="주소" value={partner.partneraddress} />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem label="회사 번호" value={partner.companyno} />
                <DetailItem label="회사명" value={partner.companyname} />
                <DetailItem label="공장 번호" value={partner.plantno} />
              </Grid>
              {/* 2열 */}
              <Grid item xs={12} md={6}>
                <DetailItem label="공장명" value={partner.plantname} />
                <DetailItem label="등록자" value={partner.creatorname} />
                <DetailItem label="등록일시" value={formatDate(partner.createdatetime)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem label="수정자" value={partner.modifername} />
                <DetailItem label="수정일시" value={formatDate(partner.modiferdatetime)} />
              </Grid>
            </Grid>
          </Paper>
        ))
      ) : (
        !loading && !error && (
          <Typography variant="body1" color="text.secondary">
            해당 기간에 맞는 업체 정보가 없습니다.
          </Typography>
        )
      )}

      {/* 뒤로가기 버튼 */}
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

// 상세 정보 표시를 위한 재사용 가능한 컴포넌트
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

export default Modal2;