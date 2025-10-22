import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/login/authSlice';
import { AppDispatch } from '../store';
// import axios from 'axios';
import '../Assets/CSS/Login.css';
import { useNavigate } from 'react-router';
import { UserState } from '../Interface/Users';
import { Alert } from '@mui/material';
import APIs, { endpoints, fetchCsrfToken } from '../Config/APIs';
import { useNotification } from '../Context/Notification';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isError, setIsError] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("")
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showNotification} = useNotification()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    

    try {
      const response = await APIs.post(endpoints.login, {
        username,
        password
      });
      const ref = searchParams.get("ref")
      if (!response.data?.isAuthenticated2Fa) {
        const user:UserState = response.data;
        if (user && !user.isAuthenticated2Fa) {
          dispatch(login({
            ...user,
            isAuthenticated: true,
          }));
          fetchCsrfToken()
          
          if (ref) 
          {
            navigate(`${ref}`)
          } 
          else {
            navigate("/products")
          }
         
        } else {
          showNotification(t(`${response.data.message}`), "warning")
        }
      }
      else {
        navigate("/login/2fa-verify", {
          state: {
            _id: response.data._id,
            secretKey2FA: response.data.secretKey2FA,
            ref: ref,
          }
        })
      }
      
    } catch (error:any) {
      setIsError(true);
      setErrorMessage(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false)
    }
  };
  const handleNavigateToRegister = () => {
    const ref = window.location.pathname
    navigate(`/register?ref=${ref}`)
  }

  const handleNavigateToGenerateOTPForForgotPassword = () => {
    const ref = window.location.pathname
    navigate(`/generate-otp?ref=${ref}`)
  }

  useEffect(() => {
    // console.log(from)
  }, [isError])

  return (
    <div className="login-container">
      {loading && <div className="loading-spinner"></div>}
      <div className="login-box">
        <h2>{t("Welcome Back")}</h2>
        <p className="login-subtitle">{t("Please login to your account")}</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">{t("Username/Email/Phone")}</label>
            <input
              id="username"
              type="text"
              placeholder={t("Enter your username")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t("Password")}</label>
            <input
              id={t("password")}
              type="password"
              placeholder={t("Enter your password")}
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
          <a className="forgotpassword-subtitle"  onClick={() =>handleNavigateToGenerateOTPForForgotPassword() }>{t("Do you forgot your password?")}</a>
          </div>
          <div className="form-group">
          <button type="submit" className="login-button">
            {t("Login")}
          </button>
          <div className="line">
            
          </div>
          <button
            className="register-button"
            onClick={() => handleNavigateToRegister()}
          >
           {t("Register")}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;