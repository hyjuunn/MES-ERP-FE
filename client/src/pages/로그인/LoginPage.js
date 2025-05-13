import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Link 추가

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('입력된 값이 없습니다.');
    } else {
      setError('');
      navigate('/main', { state: { username, plantNumber: 1 } });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>iM1NE</h1>
        <h2>생산 현장 관리시스템</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" style={styles.button}>로그인</button>
        </form>
        <div style={styles.links}>
          <a href="#">아이디 찾기</a> | <a href="#">비밀번호 찾기</a>
        </div>
        <div style={styles.adminLink}>
          <Link to="/admin" state={{ username, password }} style={{ fontSize: '13px', color: '#555' }}>
            🔒 관리자 페이지로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: 'hotpink',
    marginBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px',
    fontSize: '18px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  links: {
    marginTop: '15px',
    fontSize: '14px',
  },
  adminLink: {
    marginTop: '10px',
  }
};
