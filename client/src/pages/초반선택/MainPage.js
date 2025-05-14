import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import axios from 'axios';


export default function MainPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username || 'Unknown';
  const plantNumber = location.state?.plantNumber || 'N/A';

  const [commonCodes, setCommonCodes] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null); // 👈 선택된 공정 상태

  useEffect(() => {
    axios.get('https://mes-erp.onrender.com/getCommonCode')
      .then((response) => {
        // categorycode가 'areaCode'인 것만 필터링
        const areaCodes = response.data.filter(item => item.categorycode === 'areaCode');
        setCommonCodes(areaCodes);
      })
      .catch((error) => {
        console.error('데이터 가져오기 실패:', error);
      });
  }, []);

  const handleProcessClick = (code) => {
    setSelectedProcess(code);
    navigate('/second', {
        state: {
            username,
            plantNumber,
            selectedProcess: code,
        }
    })
  }

  return (
    <div style={styles.container}>
      <h1>환영합니다, {username}님</h1>
      <p><strong>공장 번호:</strong> {plantNumber}</p>

      {/* 공정목록 */}
      <div style={styles.processContainer}>
        <Typography variant="h5" align="left" gutterBottom>
          ● 공정목록
        </Typography>
        <div style={styles.buttonContainer}>
          {commonCodes.slice(0, 2).map((code, index) => (
            <Button
              key={index}
              variant="contained"
              sx={{
                width: '40vw',
                aspectRatio: '1',
                fontSize: '5vw',
                backgroundColor: 'lightgrey',
                color: 'black',
              }}
              onClick={() => handleProcessClick(code)} // 👈 공정 선택
            >
              {code.displayname}
            </Button>
          ))}
        </div>
      </div>

      {/* 공정 상세 정보 */}
      {selectedProcess && (
        <div style={styles.detailBox}>
          <h2>선택된 공정: {selectedProcess.displayname}</h2>
        </div>
      )}

      <button onClick={() => window.location.href = '/'}>로그아웃</button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: '100px',
    fontSize: '20px',
  },
  processContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailBox: {
    marginTop: '40px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
};
