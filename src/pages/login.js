import React, { useState } from 'react';

const AuthComponent = (props) => {
  const [loginData, setLoginData] = useState({ user_name: '', password: '' });
  const [registerData, setRegisterData] = useState({
    user_name: '',
    role_name: '',
    birthday: '',
    phone_number: '',
    email: '',
    password: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      if (response.ok) {
        const data = await response.json();
        // Set token in local storage or state
        props.setIsLoggedIn(true);
        const accessToken = data.result.access_token; // Trích xuất access_token
        localStorage.setItem('token', accessToken); // Lưu token vào localStorage
        console.log('Login successful');
        
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  
  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        const data = await response.json();
        // Set token in local storage or state
        setIsLoggedIn(true);
        console.log('Registration successful');
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div>
      
        <div>
          <h2>Login</h2>
          <input
            type="userName"
            placeholder="User Name"
            value={loginData.user_name}
            onChange={(e) => setLoginData({ ...loginData, user_name: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
          <button onClick={handleLogin}>Login</button>

          <h2>Register</h2>
          {/* Add input fields for registration data */}
          <button onClick={handleRegister}>Register</button>
        </div>
    </div>
  );
};

export default AuthComponent;
