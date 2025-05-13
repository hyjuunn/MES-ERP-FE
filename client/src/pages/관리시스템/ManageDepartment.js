import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button,
  Paper, Table, TableBody, TableCell, TableRow,
  Divider, TableHead, Checkbox, CircularProgress, Alert,
  FormControlLabel, Switch
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DepartmentManagement = () => {
  const navigate = useNavigate();

  // State for department management
  const [deptSearchTerm, setDeptSearchTerm] = useState('');
  const [departments, setDepartments] = useState([]);
  const [newDeptName, setNewDeptName] = useState('');
  const [deptNoteContent, setDeptNoteContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for employee management
  const [empSearchTerm, setEmpSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [empNoteContent, setEmpNoteContent] = useState('');
  const [showDeleted, setShowDeleted] = useState(false); // 삭제된 부서원 표시 여부

  // API configuration
  const API_URL = 'http://localhost:3000';

  // Fetch departments and employees on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch departments
        const deptResponse = await axios.get(`${API_URL}/getDepartments`);
        setDepartments(deptResponse.data);
        
        // Fetch employees (삭제된 부서원 포함)
        const empResponse = await axios.get(`${API_URL}/getEmployees`);
        setEmployees(empResponse.data);
        filterEmployees(empResponse.data, empSearchTerm, showDeleted);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Data fetching failed:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // date calc
// const workDuration = hireDate ? getWorkDuration(hireDate) : '-';
// const hireDate = emp.hire_date ? new Date(emp.hire_date) : null;
// const getWorkDuration = (startDate) => {
//   const today = new Date();

//   let months =
//     (today.getFullYear() - startDate.getFullYear()) * 12 +
//     (today.getMonth() - startDate.getMonth());

//   // 시작 날짜의 일이 오늘보다 크면, 한 달 차감하고 일 수 조정
//   let days = today.getDate() - startDate.getDate();
//   if (days < 0) {
//     months -= 1;
//     const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
//     days += prevMonth.getDate(); // 이전 달의 총 일수 더하기
//   }

//   return `${months}개월 ${days}일`;
// };

  // 직원 필터링 함수
  const filterEmployees = (empList, searchTerm, showDeletedFlag) => {
    const filtered = empList.filter(emp => {
      const matchesSearch = 
        (emp.name && emp.name.includes(searchTerm)) ||
        (emp.position && emp.position.includes(searchTerm)) ||
        (emp.departmentname && emp.departmentname.includes(searchTerm));
      
      const matchesDeletedStatus = showDeletedFlag ? true : !emp.is_deleted;
      
      return matchesSearch && matchesDeletedStatus;
    });
    setFilteredEmployees(filtered);
  };

  // 검색어 또는 삭제된 부서원 표시 상태 변경 시 필터링
  useEffect(() => {
    filterEmployees(employees, empSearchTerm, showDeleted);
  }, [empSearchTerm, showDeleted, employees]);

  // Department functions
  const handleAddDepartment = async () => {
    if (!newDeptName.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/addDepartment`, {
        department_name: newDeptName
      });

      setDepartments([...departments, response.data]);
      setNewDeptName('');
    } catch (err) {
      console.error('Failed to add department:', err);
      alert('부서 추가에 실패했습니다.');
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (!window.confirm('정말 이 부서를 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`${API_URL}/deleteDepartment/${departmentId}`);
      setDepartments(departments.filter(dept => dept.department_id !== departmentId));
    } catch (err) {
      console.error('Failed to delete department:', err);
      alert('부서 삭제에 실패했습니다.');
    }
  };

  const handleSaveDept = async () => {
    try {
      await axios.put(`${API_URL}/updateDepartments`, {
        departments: departments
      });
      alert('부서 정보가 성공적으로 저장되었습니다!');
    } catch (err) {
      console.error('Failed to save departments:', err);
      alert('부서 정보 저장에 실패했습니다.');
    }
  };

  const handleSaveDeptNote = async () => {
    if (!deptNoteContent.trim()) return;

    try {
      await axios.post(`${API_URL}/saveDepartmentNote`, {
        note: deptNoteContent
      });
      alert('부서 Note가 저장되었습니다!');
      setDeptNoteContent('');
    } catch (err) {
      console.error('Failed to save note:', err);
      alert('Note 저장에 실패했습니다.');
    }
  };

  // Employee functions
  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleDeleteEmployees = async () => {
    if (selectedEmployees.length === 0) return;
    if (!window.confirm('선택한 사원을 부서에서 제외하시겠습니까?')) return;

    try {
      await axios.post(`${API_URL}/removeEmployeesFromDepartment`, {
        employeeIds: selectedEmployees
      });
      
      // Refresh employee list
      const response = await axios.get(`${API_URL}/getEmployees`);
      setEmployees(response.data);
      setSelectedEmployees([]);
    } catch (err) {
      console.error('Failed to remove employees:', err);
      alert('사원 제외에 실패했습니다.');
    }
  };

  const handleRestoreEmployees = async () => {
    if (selectedEmployees.length === 0) return;
    if (!window.confirm('선택한 사원을 복원하시겠습니까?')) return;

    try {
      await axios.post(`${API_URL}/restoreEmployees`, {
        employeeIds: selectedEmployees
      });
      
      // Refresh employee list
      const response = await axios.get(`${API_URL}/getEmployees`);
      setEmployees(response.data);
      setSelectedEmployees([]);
    } catch (err) {
      console.error('Failed to restore employees:', err);
      alert('사원 복원에 실패했습니다.');
    }
  };

  const handleSaveEmp = async () => {
    try {
      await axios.put(`${API_URL}/updateEmployees`, {
        employees: employees
      });
      alert('부서원 정보가 성공적으로 저장되었습니다!');
    } catch (err) {
      console.error('Failed to save employees:', err);
      alert('부서원 정보 저장에 실패했습니다.');
    }
  };

  const handleSaveEmpNote = async () => {
    if (!empNoteContent.trim()) return;

    try {
      await axios.post(`${API_URL}/saveEmployeeNote`, {
        note: empNoteContent
      });
      alert('부서원 Note가 저장되었습니다!');
      setEmpNoteContent('');
    } catch (err) {
      console.error('Failed to save employee note:', err);
      alert('부서원 Note 저장에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          다시 시도
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      p: 3,
      backgroundColor: '#f5f5f5'
    }}>
      {/* Main content */}
      <Box sx={{ 
        display: 'flex', 
        flex: 1, 
        gap: 3,
        '@media (max-width: 900px)': {
          flexDirection: 'column'
        }
      }}>
        {/* Department Management Section */}
        <Box sx={{
          flex: 1,
          p: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          <Typography variant="h5" sx={{ 
            mb: 2, 
            fontWeight: 'bold',
            color: 'primary.main'
          }}>
            부서 관리
          </Typography>

          {/* Department Search */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
              부서 검색
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="부서명을 입력하세요"
              value={deptSearchTerm}
              onChange={(e) => setDeptSearchTerm(e.target.value)}
              sx={{ backgroundColor: 'white' }}
            />
          </Box>

          {/* Department List */}
          <Paper sx={{ 
            p: 2, 
            flex: 1,
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                부서 목록
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained" 
                  size="small"
                  color="primary"
                  onClick={handleSaveDept}
                  sx={{ textTransform: 'none' }}
                >
                  저장
                </Button>
              </Box>
            </Box>

            {/* Add New Department */}
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              mb: 2,
              alignItems: 'center'
            }}>
              <TextField
                fullWidth
                size="small"
                placeholder="새 부서명 입력"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                sx={{ backgroundColor: 'white' }}
              />
              <Button 
                variant="contained" 
                size="small"
                color="secondary"
                onClick={handleAddDepartment}
                sx={{ 
                  textTransform: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                부서 추가
              </Button>
            </Box>

            {/* Departments Table */}
            <Table size="small" sx={{ minWidth: 250 }}>
              <TableBody>
                {departments
                  .filter(dept => 
                    dept.department_name.toLowerCase().includes(deptSearchTerm.toLowerCase())
                  )
                  .map(dept => (
                    <TableRow 
                      key={dept.department_id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell sx={{ fontSize: '0.875rem' }}>
                        {dept.department_name}
                      </TableCell>
                      <TableCell align="right">
                        <Button 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteDepartment(dept.department_id)}
                          sx={{ textTransform: 'none' }}
                        >
                          삭제
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>

          {/* Department Note */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
              부서 Note
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="부서 관련 메모를 입력하세요..."
              value={deptNoteContent}
              onChange={(e) => setDeptNoteContent(e.target.value)}
              sx={{ backgroundColor: 'white' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button 
                variant="contained"
                color="primary"
                onClick={handleSaveDeptNote}
                disabled={!deptNoteContent.trim()}
                sx={{ textTransform: 'none' }}
              >
                Note 저장
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Vertical Divider - Visible only on larger screens */}
        <Divider 
          orientation="vertical" 
          flexItem 
          sx={{ 
            '@media (max-width: 900px)': {
              display: 'none'
            } 
          }} 
        />

        {/* Employee Management Section */}
        <Box sx={{
          flex: 1,
          p: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          <Typography variant="h5" sx={{ 
            mb: 2, 
            fontWeight: 'bold',
            color: 'primary.main'
          }}>
            부서원 관리
          </Typography>

          {/* Employee Search and Actions */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
              부서원 지정
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              mb: 2,
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <TextField
                fullWidth
                size="small"
                placeholder="부서원 검색 (이름, 직위, 부서)"
                value={empSearchTerm}
                onChange={(e) => setEmpSearchTerm(e.target.value)}
                sx={{ 
                  backgroundColor: 'white',
                  flex: '1 1 200px'
                }}
              />
              
              {/* 삭제된 부서원 표시 토글 */}
              <FormControlLabel
                control={
                  <Switch
                    checked={showDeleted}
                    onChange={() => setShowDeleted(!showDeleted)}
                    color="primary"
                  />
                }
                label="삭제된 부서원 표시"
                sx={{ ml: 1 }}
              />
              
              {/* 삭제/복원 버튼 (상태에 따라 변경) */}
              {showDeleted ? (
                <Button 
                  variant="outlined" 
                  size="small"
                  color="success"
                  onClick={handleRestoreEmployees}
                  disabled={selectedEmployees.length === 0}
                  sx={{ 
                    textTransform: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  복원
                </Button>
              ) : (
                <Button 
                  variant="outlined" 
                  size="small"
                  color="error"
                  onClick={handleDeleteEmployees}
                  disabled={selectedEmployees.length === 0}
                  sx={{ 
                    textTransform: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  삭제
                </Button>
              )}
              
              <Button 
                variant="contained" 
                size="small"
                color="primary"
                onClick={handleSaveEmp}
                sx={{ 
                  textTransform: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                정보 저장
              </Button>
            </Box>
          </Box>

          {/* Employees Table */}
          <Paper sx={{ 
            p: 2, 
            flex: 1,
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            <Table size="small" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '40px' }}>선택</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>성명</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>직위</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>휴대폰</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>생년월일</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>입사일</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>연차</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>부서</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>상태</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map(emp => (
                  <TableRow 
                    key={emp.employee_id}
                    hover
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      backgroundColor: emp.is_deleted ? '#ffebee' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Checkbox
                        size="small"
                        checked={selectedEmployees.includes(emp.employee_id)}
                        onChange={() => handleEmployeeSelect(emp.employee_id)}
                      />
                    </TableCell>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.position || '-'}</TableCell>
                    <TableCell>{emp.phone || '-'}</TableCell>
                    <TableCell>{emp.birthdate ? new Date(emp.birthdate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>{emp.hire_date ? new Date(emp.hire_date).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>{emp.hire_date}</TableCell>
                    <TableCell>{emp.departmentname || '-'}</TableCell>
                    <TableCell>
                      {emp.is_deleted ? (
                        <Typography color="error">삭제됨</Typography>
                      ) : (
                        <Typography color="success.main">활성</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {/* Employee Note */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
              부서원 Note
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="부서원 관련 메모를 입력하세요..."
              value={empNoteContent}
              onChange={(e) => setEmpNoteContent(e.target.value)}
              sx={{ backgroundColor: 'white' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button 
                variant="contained"
                color="primary"
                onClick={handleSaveEmpNote}
                disabled={!empNoteContent.trim()}
                sx={{ textTransform: 'none' }}
              >
                Note 저장
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Back Button */}
      <Box sx={{ 
        textAlign: 'center', 
        mt: 3,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ 
            backgroundColor: 'grey.300',
            color: 'text.primary',
            textTransform: 'none',
            px: 4,
            '&:hover': {
              backgroundColor: 'grey.400'
            }
          }}
        >
          뒤로가기
        </Button>
      </Box>
    </Box>
  );
};

export default DepartmentManagement;