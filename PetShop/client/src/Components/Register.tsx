import React, { useState, useEffect } from "react";
import "../Assets/CSS/Register.css";
import { useNavigate } from "react-router";
import APIs, { authApi, endpoints } from "../Config/APIs";
import axios from "axios";

import { useTranslation } from "react-i18next";
import { useNotification } from "../Context/Notification";
import { useSearchParams } from "react-router-dom";
import { Box, Button, TextField, Typography, Container, Paper, Avatar, IconButton, Grid } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams()

  const [userRegister, setUserRegister] = useState({
    username: "",
    password: "",
    avatar: null as File | null,
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const { t } = useTranslation();
  const { showNotification } = useNotification();

  /* ------------------- VALIDATORS ------------------- */

  const handleValidatePhone = (phone: string) => {
    const cleaned = phone.trim().replace(/[\s\-\.]/g, "");
    const mobilePattern = /^(?:(?:\+84|84|0084)?(3[2-9]|5[2689]|7[06-9]|8[1-5]|9[0-46-9]))\d{7}$/;
    const landlinePattern = /^(?:(?:\+84|84|0084)?0?)([2-9]\d{1,2})\d{7,8}$/;
    return mobilePattern.test(cleaned) || landlinePattern.test(cleaned);
  };

  const handleValidatePassWord = (passWord: string) => {
    // at least 8 chars, 1 upper, 1 lower, 1 number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(passWord);
  };

  const handleValidateFullName = (fullname: string) => {
    // letters + space, apostrophe, dot, dash; length 2-50
    return /^[\p{L}][\p{L}\s'.-]{1,49}$/u.test(fullname.trim());
  };

  const handleValidateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleValidateAddress = (address: string) =>
    address.trim().length >= 5;

  const handleValidateAvatar = (files: File[]) => {
    const MAX_FILES = 1;
    const MAX_CAPACITY = 2 * 1024 * 1024; // 2 MB
    if (files.length > MAX_FILES) {
      showNotification(t("You can only upload a maximum of one photo for avatar!"), "warning");
      return false;
    }
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_CAPACITY) {
      showNotification(t("The maximum capacity for uploading avatar is 2MB!"), "warning");
      return false;
    }
    if (files.length === 0) {
      showNotification(t("You have to upload at least one photo for avatar to register account!"), "warning");
      return false;
    }
    const nonImages = files.find((file) => !file.type.startsWith("image/"));
    if (nonImages) {
      showNotification(t("Only image files are allowed!"), "warning");
      return false;
    }
    return true; // ✅ Important
  };

  /* ------------------- EVENT HANDLERS ------------------- */

  const handleSetState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files) {
      const selectedFiles = Array.from(files) as File[];
      if (handleValidateAvatar(selectedFiles)) {
        const file = selectedFiles[0];
        setUserRegister((prev) => ({ ...prev, avatar: file }));
        setPreviewAvatar(URL.createObjectURL(file));
      }
      return;
    }
    else {
      setUserRegister((prev) => ({ ...prev, [name]: value }));
    }
  }

  const handleUploadAvatarOnToCloudinary = async (userId: string, avatar: File) => {
    // console.log("userId", userId)
    // console.log("Avatar", avatar)
    const data = new FormData();
    data.append("file", avatar);
    data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET || "");
    data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME || "");
    data.append("folder", process.env.REACT_APP_FOLDER_CLOUD || "");

    // Upload to Cloudinary
    const res = await axios.post(
      `${endpoints["uploadAvatarToCloudinary"](
        process.env.REACT_APP_BASE_CLOUD_URL,
        process.env.REACT_APP_CLOUD_NAME,
        process.env.REACT_APP_DIR_CLOUD
      )}`,
      data
    );

    // console.log("res data of Cloudinary: ", res.data)
    // console.log("res status of Cloudinary: ", res.status)
    // console.log("secure_url of Cloudinary: ", res.data.secure_url)
    // Handle Upload Avatar For User
    if (res.status === 200) {
        // console.log("In update avatar")
        try {
        await authApi.put(endpoints["updateAvatar"](userId), {
          avatar: res.data.secure_url
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Run all validations before uploading
    if (!handleValidateFullName(userRegister.name)) {
      showNotification(t("Full name must be 2–50 valid characters"), "warning");
      return;
    }
    if (!handleValidatePassWord(userRegister.password)) {
      showNotification(
        t("Password must be at least 8 characters and include uppercase, lowercase and a number"),
        "warning"
      );
      return;
    }
    if (!handleValidateEmail(userRegister.email)) {
      showNotification(t("Invalid email format"), "warning");
      return;
    }
    if (!handleValidatePhone(userRegister.phone)) {
      showNotification(t("Phone is not valid in Vietnam. Please try again"), "warning");
      return;
    }
    if (!handleValidateAddress(userRegister.address)) {
      showNotification(t("Address must be at least 5 characters"), "warning");
      return;
    }
    if (!userRegister.avatar) {
      showNotification(t("Please upload an avatar"), "warning");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...userRegister,
        avatar: "",
      };

      // Register account
      const res = await APIs.post(endpoints.register, payload);
      if (res.status === 201) {
        showNotification(t("Register account successfully"), "success");
        // console.log("userRegister Avatar: ", userRegister.avatar)
        handleUploadAvatarOnToCloudinary(res.data.doc._id,userRegister.avatar)
        handleRedirectToLogin()
      } else {
        showNotification(t(`Register account failed! ${res.data.message} `), "error");
      }
    } catch (error: any) {
      console.error("Error uploading image or registering:", error);
      showNotification(t("An error occurred. Please try again later"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToLogin = () => {
    const ref = searchParams.get("ref")
    navigate(`${ref}`)
  }

  // Clean up memory when component unmounts or avatar changes
  useEffect(() => {
    return () => {
      if (previewAvatar) URL.revokeObjectURL(previewAvatar);
    };
  }, [previewAvatar]);

  /* ------------------- JSX ------------------- */
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--pet-bg)', p: { xs: 2, md: 5 } }}>
      {loading && <Box className="loading-spinner"></Box>}
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', bgcolor: '#fff' }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, position: 'relative' }}>
            <IconButton onClick={() => handleRedirectToLogin()} sx={{ position: 'absolute', left: 0, color: '#ff9800', bgcolor: '#fff3e0', '&:hover': { bgcolor: '#ffe0b2' } }}>
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="900" sx={{ color: '#3e2723' }}>{t("Create Account")}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>{t("Join our pet-loving community today!")}</Typography>
            </Box>
          </Box>
          
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={previewAvatar || ""}
                  alt="Avatar Preview"
                  sx={{ width: 120, height: 120, bgcolor: '#fdfbf7', border: '3px dashed #ffb74d' }}
                >
                  {!previewAvatar && <PetsIcon sx={{ fontSize: 40, color: '#ffe0b2' }} />}
                </Avatar>
                <IconButton color="primary" aria-label="upload picture" component="label" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#ff9800', color: '#fff', '&:hover': { bgcolor: '#f57c00' }, boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                  <input hidden accept="image/*" type="file" name="avatar" onChange={handleSetState} />
                  <PhotoCamera />
                </IconButton>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label={t("Username")} name="username" value={userRegister.username} onChange={handleSetState} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="password" label={t("Password")} name="password" value={userRegister.password} onChange={handleSetState} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label={t("Full Name")} name="name" value={userRegister.name} onChange={handleSetState} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="email" label={t("Email")} name="email" value={userRegister.email} onChange={handleSetState} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="tel" label={t("Phone")} name="phone" value={userRegister.phone} onChange={handleSetState} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label={t("Address")} name="address" value={userRegister.address} onChange={handleSetState} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} multiline rows={2} />
              </Grid>
              
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  disabled={loading}
                  sx={{ mt: 2, py: 1.8, fontSize: '1.1rem', fontWeight: 800, bgcolor: '#ff9800', color: '#fff', borderRadius: '30px', boxShadow: '0 8px 20px rgba(255, 152, 0, 0.3)', '&:hover': { bgcolor: '#f57c00', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
                >
                  {t("Register")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
