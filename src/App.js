import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainDash from './components/MainDash/MainDash';
import RightSide from './components/RigtSide/RightSide';
import Sidebar from './components/Sidebar';
import '../src/style/index.css';

// Giả sử bạn đã tạo các trang này
// import DashboardPage from './pages/DashboardPage';

import SubdivisionPage from './pages/subdivision';
import AnalyticPage from './pages/analytic';
import CustomerPage from './pages/customer';
import OrdersPage from './pages/order';
import ProjectPage from './pages/project';
import { useEffect, useState } from 'react';
import AuthComponent from './pages/login';
import AccountPage from './pages/customer';
import VillaPage from './pages/villa';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add this state for authentication

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  return (
    <Router>
      <div className="App">
        {isLoggedIn ? (
          <div className="AppGlass">
            <>
              <Sidebar />
              <Routes>
              <Route
                path="/"
                element={
                  <>
                    <MainDash />
                    <RightSide />
                  </>
                }
              />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/accounts" element={<AccountPage />} />
                <Route path="/subdivisions" element={<SubdivisionPage />} />
                <Route path="/projects" element={<ProjectPage />} />
                <Route path="/villas" element={<VillaPage />} />
                <Route path="/analytics" element={<AnalyticPage />} />
              </Routes>
           
            </>
          </div>
        ) : (
          <div>
            <AuthComponent setIsLoggedIn={setIsLoggedIn} />
          </div>
        )}  
      </div>
    </Router>
  );
}

export default App;