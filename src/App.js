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

import OrdersPage from './pages/order';
import ProjectPage from './pages/project';
import { useEffect, useState } from 'react';
import AuthComponent from './pages/login';
import AccountPage from './pages/customer';
import VillaPage from './pages/villa';
import TimeSharePage from './pages/timeshare';

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
              <div className="Header absolute top-10 right-0 flex items-center p-4 mr-20 text-white">
                <div className="mr-4">
                  <p className="text-lg font-bold text-blue-300">Hello, ADMIN!</p> 
                </div>
                <div className="rounded-full h-10 w-10 bg-gray-500 mr-4"></div>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-2 rounded"
                >
                  Logout
                </button>
              </div>
              <Routes>
              
                <Route path="/" element={<MainDash />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/accounts" element={<AccountPage />} />
                <Route path="/subdivisions" element={<SubdivisionPage />} />
                <Route path="/projects" element={<ProjectPage />} />
                <Route path="/villas" element={<VillaPage />} />
                <Route path="/timeshares" element={<TimeSharePage />} />
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