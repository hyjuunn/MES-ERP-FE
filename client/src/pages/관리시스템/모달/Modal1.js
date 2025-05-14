import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Modal1 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { partno, partname } = location.state || {};
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const params = {};
        if (partno) params.partno = partno;
        if (partname) params.partname = partname;

        const res = await axios.get('https://mes-erp.onrender.com/searchItem', { params });
        setItems(res.data);
      } catch (err) {
        console.error('조회 실패:', err);
      }
    };

    fetchItems();
  }, [partno, partname]);

  const headers = [
    { key: 'partno', label: '품목코드' },
    { key: 'majorcategoryfamily', label: '카테고리 대분류' },
    { key: 'minorcategoryfamily', label: '카테고리 중분류' },
    { key: 'detailcategoryfamily', label: '카테고리 세분류' },
    { key: 'partname', label: '품목명' },
    { key: 'partspec', label: '규격 (원산지 포함)' },
    { key: 'parttype', label: '품목유형 (제품, 반제품, 기타)' },
    { key: 'partstatus', label: '품목상태 (유효, 단종, 기타)' },
    { key: 'partbomstatus', label: 'BOM 확정 상태' },
    { key: 'salespersoncd', label: '영업담당자 코드' },
    { key: 'salespersonname', label: '영업담당자명' },
    { key: 'salesdeptcd', label: '영업부서 코드' },
    { key: 'salesdeptname', label: '영업부서명' },
    { key: 'partclassification', label: '관리유형' },
    { key: 'customercd', label: '고객코드' },
    { key: 'customername', label: '고객명' },
    { key: 'creatorname', label: '등록자' },
    { key: 'createdatetime', label: '등록일시' },
    { key: 'partnote', label: '특이사항' },
    { key: 'partinspectionlevel', label: '품질검사 유무' },
    { key: 'partinspectiontype', label: '검사유형' },
    { key: 'supplytype', label: '조달구분' },
    { key: 'partlifecyclestatus', label: 'Life Cycle 상태' },
    { key: 'companyno', label: '회사번호' },
    { key: 'companyname', label: '회사명' },
    { key: 'plantno', label: '공장번호' },
    { key: 'plantname', label: '공장명' },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>
        조회 결과 - 품목정보 전체
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {headers.map(({ label }, idx) => (
                <TableCell key={idx} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map((row, idx) => (
                <TableRow key={idx}>
                  {headers.map(({ key }) => (
                    <TableCell key={key}>
                      {row[key] !== null && row[key] !== undefined ? String(row[key]) : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headers.length} align="center">
                  조회된 데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ backgroundColor: 'lightgray', color: 'black' }}
        >
          뒤로가기
        </Button>
      </Box>
    </Box>
  );
};

export default Modal1;
