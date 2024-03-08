import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Box, Typography, Checkbox, FormControlLabel, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';

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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Load credentials from local storage on component mount
    const savedUserName = localStorage.getItem('savedUserName');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedUserName && savedPassword) {
      setLoginData({ user_name: savedUserName, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    console.log("Toggling password visibility:", !showPassword); // Debugging
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
    console.log("Remember Me state:", event.target.checked); // Debugging
  };


  
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
        // Set token and user_id in local storage
        props.setIsLoggedIn(true);
        const accessToken = data.result.access_token;
        const user_id = data.result.user_id;
        localStorage.removeItem('user_id',user_id)
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user_id', user_id);
        console.log('Login successful');
        toast.success("Login successful");
        if (rememberMe) {
          // Save credentials to local storage
          localStorage.setItem('savedUserName', loginData.user_name);
          localStorage.setItem('savedPassword', loginData.password);
        } else {
          // Clear saved credentials if "Remember Me" is not checked
          localStorage.removeItem('savedUserName');
          localStorage.removeItem('savedPassword');
        }
      } else {
        console.error('Login failed');
        toast.error("Login failed");
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  


  return (
    <Container className="flex items-center justify-center min-h-screen">
      <Box className="bg-white p-8 shadow-lg" sx={{ maxWidth: 400 }}>
        <Typography variant="h5" className="font-bold text-center mb-4">Đăng nhập</Typography>
        <form>
          <TextField
            fullWidth
            id="username"
            label="Tên đăng nhập"
            margin="normal"
            variant="outlined"
            value={loginData.user_name}
            onChange={(e) => setLoginData({ ...loginData, user_name: e.target.value })}
          />
          <TextField
            fullWidth
            id="password"
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            variant="outlined"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={handleRememberMeChange}
                color="primary"
              />
            }
            label="Nhớ mật khẩu"
          />
       

          <Button
            fullWidth
            variant="contained"
            color="primary"
            className="mt-4"
            onClick={handleLogin}
          >
            Đăng nhập
          </Button>
        </form>
      </Box>
      <ToastContainer/>
    </Container>
  );
};

export default AuthComponent;