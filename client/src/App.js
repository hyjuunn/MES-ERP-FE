// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // MUI 추가
import { CssBaseline } from '@mui/material'; // 선택 사항 (스타일 리셋)
import { GlobalProvider } from './context/GlobalContext';

import AdminPage from './pages/관리시스템/AdminPage';
import ManageDepartment from './pages/관리시스템/ManageDepartment';
import LoginPage from './pages/로그인/LoginPage';
import MainPage from './pages/초반선택/MainPage';
import SecondPage from './pages/초반선택/SecondPage';
import ThirdPage from './pages/초반선택/ThirdPage';
import FourthPage from './pages/초반선택/FourthPage';
import FifthPage from './pages/진행/FifthPage';
import SixthPage from './pages/대기지연/SixthPage';
import ProcessReport from './pages/공정정지(휴식)/ProcessReport';
import EnterProduction from './pages/공정정지(휴식)/EnterProduction';
import ReplenishmentRequest from './pages/후보충 요청/ReplenishmentRequest';
import ReportProductionResult from './pages/공정보고/ReportProductionResult';
import ReasonForDeficiency from './pages/공정보고/ReasonForDeficiency';
import WorkLogReg from './pages/공정보고/WorkLogReg';
import CheckItemList from './pages/대기지연/CheckItemList';
import ManageInterface from './pages/관리시스템/ManageInterface';
import ManageModal from './pages/관리시스템/모달/ManageModal';
import Modal1 from './pages/관리시스템/모달/Modal1';
import Modal2 from './pages/관리시스템/모달/Modal2';
import Modal3 from './pages/관리시스템/모달/Modal3';
import CurrentInventory from './pages/대기지연/CurrentInventory';

const theme = createTheme(); // 기본 테마 생성

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* 선택: 브라우저 기본 스타일 리셋 */}
      <GlobalProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/manageDepartment" element={<ManageDepartment />} />
            <Route path="/manageInterface" element={<ManageInterface />} />
            <Route path="/manageModal" element={<ManageModal />} />
            <Route path="/modal1" element={<Modal1 />} />
            <Route path="/modal2" element={<Modal2 />} />
            <Route path="/modal3" element={<Modal3 />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/second" element={<SecondPage />} />
            <Route path="/third" element={<ThirdPage />} />
            <Route path="/fourth" element={<FourthPage />} />
            <Route path="/fifth" element={<FifthPage />} />
            <Route path="/sixth" element={<SixthPage />} />
            <Route path="/processreport" element={<ProcessReport />} />
            <Route path="/enterProduction" element={<EnterProduction />} />
            <Route path="/replenishmentRequest" element={<ReplenishmentRequest />} />
            <Route path="/reportProductionResult" element={<ReportProductionResult />} />
            <Route path="/reasonForDeficiency" element={<ReasonForDeficiency />} />
            <Route path="/workLogReg" element={<WorkLogReg />} />
            <Route path="/checkItemList" element={<CheckItemList />} />
            <Route path="/currentInventory" element={<CurrentInventory />} />
          </Routes>
        </Router>
      </GlobalProvider>
    </ThemeProvider>
  );
}

// App.js
// import React from 'react';
// import ManageIPC from './ExtraStuff/ManageIPC'; // 경로에 맞게 조정

// function App() {
//   return (
//     <div>
//       <ManageIPC />
//     </div>
//   );
// }

// export default App;

// import React from 'react';
// import ProcessInspection from './ExtraStuff/ProcessInspection'; // 경로에 맞게 조정

// function App() {
//   return (
//     <div>
//       <ProcessInspection />
//     </div>
//   );
// }

// export default App;