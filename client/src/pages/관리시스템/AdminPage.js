import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Paper, MenuItem, Select, 
  InputLabel, FormControl, Button, Divider, Table, 
  TableBody, TableCell, TableRow, TableHead
} from '@mui/material';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { username, password } = state;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeTab, setActiveTab] = useState('menu');
  const [noteContent, setNoteContent] = useState('');

  // 샘플 메뉴 데이터
  const menuData = {
    '시스템관리': ['회사정보관리', '사업장관리', '부서관리', '사용자관리', '권한관리', '메뉴관리', '공통코드', '시스템로그정보'],
    '기준정보관리': ['인터페이스관리']
  };

  // 관리자 계정 아니면 리디렉션
//   if (username !== 'admin' || password !== '1013') {
//     alert('접근 권한이 없습니다.');
//     return <Navigate to="/" replace />;
//   }

  // 검색 및 필터 처리
  const filteredMenus = Object.entries(menuData)
    .flatMap(([category, menus]) =>
      menus
        .filter(menu => menu.includes(searchTerm))
        .map(menu => ({ category, name: menu }))
    .filter(menu => (selectedCategory ? menu.category === selectedCategory : true)));

  const handleLogout = () => {
    navigate('/');
  };

  const handleNoteSave = () => {
    alert('Note가 저장되었습니다!');
    setNoteContent('');
  };

  return (
    <Box sx={{ p: 4, display: 'flex', height: '100vh' }}>
      {/* 왼쪽 메뉴 관리 섹션 (40% 너비) */}
      <Box sx={{ width: '40%', pr: 2 }}>
        {/* 헤더와 로그아웃 버튼 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>🔒 관리자 페이지</Typography>
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>환영합니다, {username} 님!</Typography>

        {/* 메뉴 관리 섹션 */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ textAlign: 'left', mb: 2, fontWeight: 'bold' }}
          >
            메뉴관리
          </Typography>

          {/* 메뉴 검색 */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>메뉴검색</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="메뉴명을 입력하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Box>

          {/* 카테고리 선택 */}
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel>카테고리 선택</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="카테고리 선택"
            >
              <MenuItem value=""><em>전체 카테고리</em></MenuItem>
              <MenuItem value="시스템관리">시스템관리</MenuItem>
              <MenuItem value="기준정보관리">기준정보관리</MenuItem>
            </Select>
          </FormControl>

          {/* 메뉴 목록 */}
          <Paper sx={{ p: 2, height: '60vh', overflow: 'auto' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>메뉴목록</Typography>
            {filteredMenus.length > 0 ? (
              <Box>
                {filteredMenus.map((menu, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      p: 1.5, mb: 1, backgroundColor: '#f5f5f5',
                      borderRadius: '4px',
                      '&:hover': { backgroundColor: '#e0e0e0', cursor: 'pointer' }
                    }}
                    onClick={() => {
                        if (menu.name === '부서관리') {
                            navigate('/manageDepartment');
                        }
                        if (menu.name === '인터페이스관리') {
                            navigate('/manageInterface');
                        }
                    }}
                  >
                    <Typography variant="body2">
                      {menu.name} <small>({menu.category})</small>
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                검색 결과가 없습니다.
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>

      {/* 구분선 */}
      <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

      {/* 오른쪽 섹션 (60% 너비) */}
      <Box sx={{ width: '60%', pl: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* 상단: 도움말 관리 */}
        <Box>
          {/* 제목 + 로그아웃 버튼 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>도움말관리</Typography>
            <Button 
              variant="contained" 
              color="success"
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </Box>
          
          {/* 탭 선택 */}
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Button
              variant={activeTab === 'usage' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('usage')}
              sx={{ mr: 1 }}
            >
              선택 메뉴 사용여부
            </Button>
            <Button
              variant={activeTab === 'create' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('create')}
            >
              도움말 작성
            </Button>
          </Box>

          {/* 선택 메뉴 사용여부 탭 */}
          {activeTab === 'usage' && (
            <Paper sx={{ p: 2, mb: 3, height: '30vh', overflow: 'auto' }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                선택 메뉴 사용여부
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>그룹명</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>프로그램명</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>사용여부</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center', color: 'text.secondary' }}>
                      행이 없습니다.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          )}

          {/* 도움말 작성 탭 */}
          {activeTab === 'create' && (
            <Paper sx={{ p: 2, mb: 3, height: '30vh', overflow: 'auto' }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                도움말 작성
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                placeholder="도움말 내용을 입력하세요..."
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary">
                  저장
                </Button>
              </Box>
            </Paper>
          )}
        </Box>

        {/* 하단: Note 작성 섹션 */}
        <Paper sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
            Note
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            placeholder="자유롭게 메모를 작성하세요..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            sx={{ flex: 1, mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleNoteSave}
              disabled={!noteContent.trim()}
            >
              Note 저장
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}