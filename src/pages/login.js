import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Box, Typography, Checkbox, FormControlLabel, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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
  const [openForgetPasswordDialog, setOpenForgetPasswordDialog] = useState(false);

  useEffect(() => {
    
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

  const handleForgetPasswordClick = () => {
    setOpenForgetPasswordDialog(true);
  };

  const handleCloseForgetPasswordDialog = () => {
    setOpenForgetPasswordDialog(false);
  };
  // const handleForgetPasswordRequest = async () => {
  //   try {
    
  //     if (!email || typeof email !== 'string') {
  //       console.error('Email không hợp lệ.');
  //       return;
  //     }
  
  //     const response = await fetch('http://localhost:5000/api/v1/users/forgot-password', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email: email }),
  //     });
  
  //     if (response.ok) {
  //       console.log('Yêu cầu đặt lại mật khẩu đã được gửi.');
  //     } else {
  //       console.error('Yêu cầu đặt lại mật khẩu thất bại.');
  //     }
  //   } catch (error) {
  //     console.error('Lỗi khi gửi yêu cầu đặt lại mật khẩu:', error);
  //   }
  // };
  
  
  
  const handleLogin = async () => {
    debugger
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
       
        props.setIsLoggedIn(true);
        const accessToken = data.result.access_token; 
        localStorage.setItem('token', accessToken); 
        console.log('Login successful');
        if (rememberMe) {
         
          localStorage.setItem('savedUserName', loginData.user_name);
          localStorage.setItem('savedPassword', loginData.password);
        } else {
      
          localStorage.removeItem('savedUserName');
          localStorage.removeItem('savedPassword');
        }
        
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
          {/* <span style={{ cursor: 'pointer', color: 'blue', marginLeft: '50px' }} onClick={handleForgetPasswordClick}>
            Quên mật khẩu?
          </span> */}

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

      {/* <Dialog open={openForgetPasswordDialog} onClose={handleCloseForgetPasswordDialog}>
        <DialogTitle>Quên mật khẩu</DialogTitle>
        <DialogContent>

          <Typography>Vui lòng nhập địa chỉ email của bạn để đặt lại mật khẩu.</Typography>
          <TextField
            fullWidth
            id="email"
            label="Email"
            margin="normal"
            variant="outlined"
          // onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgetPasswordDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleForgetPasswordRequest} color="primary">
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog> */}
    </Container>
  );
};

export default AuthComponent;
