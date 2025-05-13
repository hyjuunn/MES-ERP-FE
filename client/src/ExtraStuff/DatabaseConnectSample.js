import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function App() {
  // useState - 데이터 상태를 관리합니다.
  const [data, setData] = useState([]);

  // 데이터 가져오기 함수
  const fetchProductionOrderSet = async () => {
    try {
      const response = await axios.get('http://192.168.0.41:3000/getProductionOrderSet');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching production order set:', error);
    }
  };

  const fetchCommonCode = async () => {
    try {
      const response = await axios.get('http://192.168.0.41:3000/getCommonCode');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching common code:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* 제목은 Typography 컴포넌트로 설정 */}
      <Typography variant="h4" gutterBottom>
        Data from PostgreSQL
      </Typography>

      {/* 버튼은 MUI의 Button 컴포넌트로 변경 */}
      <Button variant="contained" color="primary" onClick={fetchProductionOrderSet} style={{ marginRight: '10px' }}>
        Production Order Set
      </Button>
      <Button variant="contained" color="secondary" onClick={fetchCommonCode}>
        Common Code
      </Button>

      {/* 테이블은 MUI의 Table 컴포넌트로 변경 */}
      <Table style={{ marginTop: '20px', width: '100%' }}>
        <TableHead>
          <TableRow>
            {/* 데이터가 있을 때, 첫 번째 객체를 참고해서 컬럼 뽑기 */}
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <TableCell 
                  key={key} 
                  style={{ 
                    fontWeight: 'bold',
                    borderLeft: '3px solid #ddd',
                    borderRight: '3px solid #ddd',
                    borderTop: '3px solid #ddd',
                    borderBottom: '3px solid #ddd',
                  }}
                >
                  {key}
                </TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {/* 데이터 뿌리기 */}
          {data.map((row, index) => (
            <TableRow 
              key={index}
              style={{
                borderLeft: '1px solid #ddd',
                borderRight: '1px solid #ddd',
              }}
            >
              {Object.values(row).map((value, idx) => (
                <TableCell 
                key={idx}
                style={{
                  borderLeft: '1px solid #ddd',
                  borderRight: '1px solid #ddd',
                }}
                >{value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
