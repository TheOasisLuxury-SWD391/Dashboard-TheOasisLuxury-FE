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
  import logoImage from './images/the oasis luxury (2).png';

  import ContractPage from './pages/contract';
  import DetailsPage from './pages/detail';
  import { toast } from 'react-toastify';
  import axios from 'axios';

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
    

    return (
      <Router>
        <div className="App">
          {isLoggedIn ? (
            <div className="AppGlass">
              <>
              <Sidebar role={role} />
                <div className="Header absolute top-10 right-0 flex items-center p-4 mr-20 text-white">
                <img src={logoImage} alt="Logo" style={{ height: '80px', width: 'auto', marginRight: '1200px' }} />

                  <div className="mr-4">
                    <p className="text-lg font-bold text-blue-300">Hello, {role}!</p> 
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
                  {role === 'ADMIN' && (
                    <>
                      <Route path="/" element={<MainDash />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/accounts" element={<AccountPage />} />
                      <Route path="/contracts" element={<ContractPage />} />
                    </>
                  )}
                  {role === 'STAFF' && (
                    <>
                     <Route path="/" element={<MainDash />} />
                      <Route path="/subdivisions" element={<SubdivisionPage />} />
                      <Route path="/projects" element={<ProjectPage />} />
                      <Route path="/villas" element={<VillaPage />} />
                      <Route path="/timeshares" element={<TimeSharePage />} />
                     
                    </>
                  )}
                  <Route path="/details/:contractId" element={<DetailsPage />} />
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