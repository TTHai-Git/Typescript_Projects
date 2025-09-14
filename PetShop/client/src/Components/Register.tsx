import React, { useState, useEffect } from "react";
import "../Assets/CSS/Register.css";
// import axios from "axios";
import { useNavigate } from "react-router";
import APIs, { endpoints } from "../Config/APIs";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";
import { useTranslation } from "react-i18next";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [userRegister, setUserRegister] = useState({
    username: "",
    password: "",
    avatar: null as File | null,
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const { t } = useTranslation()


  const handleSetState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files.length > 0) {
      const file = files[0];
      setUserRegister((prev) => ({ ...prev, avatar: file }));
      setPreviewAvatar(URL.createObjectURL(file));
    } else {
      setUserRegister((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    if (userRegister.avatar) {
      data.append("file", userRegister.avatar);
    }
    data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET || "");
    data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME || "");
    data.append("folder", process.env.REACT_APP_FOLDER_CLOUD || "")

    try {
      // const res_1 = await axios.post(
      //   `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
      //   data
      // );
      const res_1 = await axios.post(
        `${endpoints['uploadAvatarToCloudinary'](
          process.env.REACT_APP_BASE_CLOUD_URL, 
          process.env.REACT_APP_CLOUD_NAME,
          process.env.REACT_APP_DIR_CLOUD
        )}`,
        data
      );
      userRegister.avatar = res_1.data.secure_url;

      // const res_2 = await axios.post('/v1/auth/register', userRegister);
      const res_2 = await APIs.post(endpoints.register, userRegister);
      if (res_2.status === 201) {
        showMessage("Register account successfully! Please check your email and phone number to verify account with OTP has sent to both", "success");
        navigate('/verify-phone');
      }
      else {
        showMessage("Register account failed! Please try again later", "error")
      }
    } catch (error:any) {
      console.error("Error uploading image:", error);
      // showMessage(error.response?.data?.message, "error")
    } finally {
      setLoading(false);
    }
  };

  // Clean up memory when component unmounts or avatar changes
  useEffect(() => {
    // console.log(process.env)
    return () => {
      if (previewAvatar) {
        URL.revokeObjectURL(previewAvatar);
      }
    };
  }, [previewAvatar]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="register-container">
      {loading && <div className="loading-spinner"></div>}
      <form className="register-form" onSubmit={handleRegister}>
        <h2>{t("Register Account")}</h2>

        <label htmlFor="username">{t("Username")}:</label>
        <input
          type="text"
          id="username"
          name="username"
          required
          value={userRegister.username}
          onChange={handleSetState}
        />

        <label htmlFor="password">{t("Password")}:</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={userRegister.password}
          onChange={handleSetState}
        />

        <label htmlFor="name">{t("Full Name")}:</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={userRegister.name}
          onChange={handleSetState}
        />

        <label>{t("Avatar")}:</label>
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleSetState}
        />
        
        {previewAvatar && (
          <img
            src={previewAvatar}
            alt="Avatar Preview"
            style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", marginTop: 10 }}
          />
        )}

        <label htmlFor="email">{t("Email")}:</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={userRegister.email}
          onChange={handleSetState}
        />

        <label htmlFor="phone">{t("Phone")}:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          value={userRegister.phone}
          onChange={handleSetState}
        />

        <label htmlFor="address">{t("Address")}:</label>
        <input
          type="text"
          id="address"
          name="address"
          required
          value={userRegister.address}
          onChange={handleSetState}
        />
        <div className="form-group">
          <button className="register-button" type="submit" disabled={loading}>{t("Register")}</button>
          <div className="line"></div>
          <button className="back-button" onClick={() => navigate('/login')}>{t("Back To Login")}</button>
        </div>
        
      </form>
      {/* Snackbar Message */}
      <Snackbar open={!!message} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={message?.type}>{message?.text}</Alert>
      </Snackbar>
    </div>
  );
};

export default Register;
