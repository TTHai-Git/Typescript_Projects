import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import '../Assets/CSS/Login.css';
// import axios from 'axios';
import APIs, { endpoints } from '../Config/APIs';
import { useNotification } from '../Context/Notification';
import { useTranslation } from 'react-i18next';

const GenerateOTP = () => {
    const [email, setEmail] = useState<string>("")
    const [loading, setLoading] = useState<Boolean>(false)
    const [isError, setIsError] = useState<Boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const navigate = useNavigate()
    const { showNotification } = useNotification()
    const { t } = useTranslation();
    const handleGenerateOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true)
            // const res = await axios.post('/v1/users/generate-otp', {
            //    email
            // })
            const res = await APIs.post(endpoints.generateOTP, {
              email
           })
            // console.log(res)
            if (res.status === 200) {
                showNotification(res.data.message, "success")
                navigate('/reset-password', {state: email})
            }
            
        } catch (error:any) {
          setIsError(true);
          setErrorMessage(error.response?.data?.message || 'Something went wrong');
            
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {

    }, [isError])
  return (
  <div className="login-container">
    {loading && <div className="loading-spinner"></div>}
    <div className="login-box">
      <h2>{t("Do you forgot your password?")}</h2>
      <p className="login-subtitle">{t("Please enter the email for your account")}</p>
      
      <form onSubmit={handleGenerateOTP} className="login-form">
        <div className="form-group">
          <label htmlFor="email">{t("Email")}</label>
          <input
            id="email"
            type="email"
            placeholder={t("Enter your email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          {isError ? (
            <p className="errorMessage">
              {t("Error")}: {errorMessage}
            </p>
          ) : null}
        </div>

        <div className="form-group">
          <button type="submit" className="login-button">
            {t("Find")}
          </button>
          <div className="line"></div>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/login")}
          >
            {t("Back")}
          </button>
        </div>
      </form>
    </div>
  </div>
);

}

export default GenerateOTP
