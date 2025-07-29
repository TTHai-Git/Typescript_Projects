import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/login/authSlice';
import { AppDispatch } from '../store';
// import axios from 'axios';
import '../Assets/CSS/Login.css';
import { useNavigate } from 'react-router';
import { UserState } from '../Interface/Users';
import { Alert } from '@mui/material';
import APIs, { endpoints } from '../Config/APIs';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isError, setIsError] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("")
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
  
      const response = await APIs.post(endpoints.login, {
        username,
        password
        });
      const user:UserState = response.data.user;
      if (user) {
        dispatch(login({
          ...user,
          isAuthenticated: true,
        }));
        if(user.role.name === 'Admin') {
          navigate("/admin-dashboard")
        }
        else {
          console.log("user", user)
          navigate("/products")
        }
      } else {
      alert('Invalid username or password');
      }
    } catch (error:any) {
      setIsError(true);
      setErrorMessage(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    // console.log(from)
  }, [isError])

  return (
    <div className="login-container">
      {loading && <div className="loading-spinner"></div>}
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Please login to your account</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username/Email/Phone</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            {isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Alert>
              )}  
          </div>
          <div className="form-group">
          <a className="forgotpassword-subtitle" href='/generate-otp' onClick={() => navigate("/generate-otp")}>Do you forgot password?</a>
          </div>
          <div className="form-group">
          <button type="submit" className="login-button">
            Login
          </button>
          <div className="line">
            
          </div>
          <button
            className="register-button"
            onClick={() => navigate('/register', { state: { from: '/login' } })}
          >
           Register
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;