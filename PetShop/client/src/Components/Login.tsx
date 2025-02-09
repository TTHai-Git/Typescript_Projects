import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/login/authSlice';
import { AppDispatch } from '../store';
import axios from 'axios';
import '../Assets/CSS/Login.css';
import { useNavigate } from 'react-router';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get('/v1/users');
      const user = response.data.find((user: { username: string; password: string; }) => 
        user.username === username && user.password === password
      );
      if (user) {
        dispatch(login({
          ...user,
          accessTokenInfo: {
            accessToken: '',
            expiresIn: 0,
          },
          isAuthenticated: false,
        }));
        navigate('/dogs');
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Please login to your account</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
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
          
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;