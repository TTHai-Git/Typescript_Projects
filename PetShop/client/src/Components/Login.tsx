import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/login/authSlice';
import { AppDispatch } from '../store';
import axios from 'axios';
import '../Assets/CSS/Login.css';
import { useLocation, useNavigate } from 'react-router';
import { UserState } from '../Interface/Users';

const Login: React.FC = () => {
  const location = useLocation();
  const from = location.state || null;
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // console.log(from)
      const response = await axios.post('/v1/auth/login', {
      username,
      password
      });
      const user:UserState = response.data.user;
      if (user) {
        dispatch(login({
          ...user,
          isAuthenticated: true,
        }));
        if (!from)
          navigate('/products');
        else {
          navigate(`${from}`)
        }
      } else {
      alert('Invalid username or password');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="login-container">
      {loading && <div className="loading-spinner"></div>}
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
          <div className="form-group">
          <a className="forgotpassword-subtitle" onClick={() => navigate("/generate-otp")}>Do you forgot password?</a>
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