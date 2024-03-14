import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainDash from './components/MainDash/MainDash';
import Sidebar from './components/Sidebar';
import '../src/style/index.css';
import SubdivisionPage from './pages/subdivision';
import OrdersPage from './pages/order';
import ProjectPage from './pages/project';
import { useEffect, useState } from 'react';
import AuthComponent from './pages/login';
import AccountPage from './pages/customer';
import VillaPage from './pages/villa';
import TimeSharePage from './pages/timeshare';
import logoImage from './images/the oasis luxury (2).png';

import ContractPage from './pages/contract';
import DetailsPage from './pages/detail';
import { toast } from 'react-toastify';
import axios from 'axios';
import OrderDetailsPage from './pages/order-detail';
import BlogPage from './pages/blog';

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add this state for authentication
  const [role, setRole] = useState("");
  const userId = localStorage.getItem("user_id");
  const accessToken = localStorage.getItem("token");


  useEffect(() => {
    if (userId && accessToken) { 
      axios.get(`http://localhost:5000/api/v1/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then((res) => {
        console.log("role",role);
        const userRole = res.data.user.role_name;
        setRole(userRole);
        setIsLoggedIn(true);
        console.log('Login successful');
        toast.success("Login successful");
      }).catch((err) => {
        console.error(err);
        toast.error("Login failed");
      });
    }
  }, [userId, accessToken]); 
  
  const handleLogout = () => {
    // Remove user_id and access_token from localStorage
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    localStorage.removeItem("savedUserName");
    localStorage.removeItem("savedPassword");

    // Reset state and set isLoggedIn to false
    setIsLoggedIn(false);
    setRole("");
  };
  return (
    <Router>
      <div className="App">
        {isLoggedIn ? (
          <div className="AppGlass">
            <>
            <Sidebar role={role} />
              <div className="Header absolute top-10 right-0 flex items-center p-4 mr-20 text-white">
              <img src={logoImage} alt="Logo" style={{ height: '80px', width: 'auto', marginRight: '1100px' }} />

                <div className="mr-4">
                  <p className="text-lg font-bold text-blue-300">Hello, {role}!</p> 
                </div>
                <div className="rounded-full h-10 w-10 bg-gray-500 mr-4"></div>
                <button
                  onClick={handleLogout} // Call the handleLogout function on button click
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-2 rounded"
                >
                  Logout
                </button>
              </div>
              <Routes>
                {role === 'ADMIN' && (
                  <>
                    <Route path="/" element={<MainDash />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/accounts" element={<AccountPage />} />
                    <Route path="/contracts" element={<ContractPage />} />
                    <Route path="/subdivisions" element={<SubdivisionPage />} />
                    <Route path="/projects" element={<ProjectPage />} />
                    <Route path="/villas" element={<VillaPage />} />
                    <Route path="/timeshares" element={<TimeSharePage />} />
                    <Route path="/blogs" element={<BlogPage />} />
                  </>
                )}
                {role === 'STAFF' && (
                  <>
                   <Route path="/" element={<MainDash />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/contracts" element={<ContractPage />} />
                    <Route path="/subdivisions" element={<SubdivisionPage />} />
                    <Route path="/projects" element={<ProjectPage />} />
                    <Route path="/villas" element={<VillaPage />} />
                    <Route path="/timeshares" element={<TimeSharePage />} />
                    <Route path="/blogs" element={<BlogPage />} />
                  </>
                )}
                <Route path="/details/:contractId" element={<DetailsPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
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