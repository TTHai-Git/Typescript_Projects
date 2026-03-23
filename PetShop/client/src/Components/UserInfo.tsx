import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useLocation, useNavigate } from 'react-router';
import { logout } from '../features/login/authSlice';
import { Chip, FormControlLabel, FormGroup, Switch, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { authApi, endpoints } from '../Config/APIs';
import { AdminPanelSettings, Favorite, Security } from '@mui/icons-material';
import { useNotification } from '../Context/Notification';
import { useTranslation } from 'react-i18next';

const UserInfo = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { showNotification } = useNotification()
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const {t} = useTranslation()

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setEditedUser({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user, navigate, user?.isAuthenticated2Fa]);

  const handleLogOut = async () => {
    dispatch(logout());
    const res = await authApi.post(endpoints.logout)
    if (res.status === 200) navigate('/login');
  };

  const handleEditToggle = () => {
    setIsEditing(prev => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value
    });
  };

  const handleEnableOrDisable2FA = () => {
    navigate(`${user?._id}/2fa?isAuthenticated2Fa=${user?.isAuthenticated2Fa}`)
  }
  const handleEnableOrDisableVerifyEmail = () => {

  }
  const handleEnableOrDisableVerifyPhone = () => {
    
  }

  const handleSave = async () => {
    try {
      const res = await authApi.put(endpoints.updateInfor(user?._id), {
        name: editedUser.name,
        email: editedUser.email,
        phone: editedUser.phone,
        address: editedUser.address
      });

      if (res.status === 200) {
        showNotification(t(`${res.data.message}`), "success");
        setIsEditing(false);
        handleLogOut();
      }
    } catch (err: any) {
      console.error("Update failed", err);
      showNotification((err.response?.data?.message || err.message), "error");
    }
  };

  
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      bgcolor="var(--pet-bg)"
      p={{ xs: 2, md: 6 }}
    >
      <Card sx={{ maxWidth: "800px", width: "100%", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        {/* Banner Cover Image */}
        <Box sx={{ height: 160, width: "100%", background: "linear-gradient(135deg, #ffb74d 0%, #ff9800 100%)", position: "relative" }}>
          {/* Decorative paw prints could go here */}
        </Box>

        <CardContent sx={{ px: { xs: 3, md: 6 }, pb: 6, mt: -8, position: "relative" }}>
          {/* User Content */}
          {user && (
            <Box>
              <Stack alignItems="center" mb={4}>
                <Box sx={{ p: 1, bgcolor: "#fff", borderRadius: "50%", display: "inline-block", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", mb: 2 }}>
                  <Avatar
                    src={user.avatar}
                    alt="User Avatar"
                    sx={{ width: 120, height: 120 }}
                  />
                </Box>
                <Typography variant="h4" fontWeight="800" sx={{ color: "#3e2723", mb: 0.5 }}>{user.name || user.username}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{user.email}</Typography>

                <Tooltip
                  title={
                    user.isVerified
                      ? t("Your email and phone is verified")
                      : t("Please verify your email and phone")
                  }
                >
                  <Chip
                    label={user.isVerified ? t("Verified") : t("Not Verified")}
                    color={user.isVerified ? "success" : "default"}
                    icon={
                      user.isVerified ? (
                        <CheckCircleIcon style={{ color: "white" }} />
                      ) : (
                        <CancelIcon style={{ color: "gray" }} />
                      )
                    }
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Tooltip>
              </Stack>
              <Box sx={{ p: 3, bgcolor: "#fffbf7", borderRadius: "20px", border: "1px solid #ffe0b2", mb: 5 }}>
                <Typography variant="subtitle1" fontWeight="800" sx={{ color: "#3e2723", mb: 2 }}>
                  {t("Security & Verification")}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="space-around">
                  <FormControlLabel
                    control={<Switch checked={user.isAuthenticated2Fa} onChange={() => handleEnableOrDisable2FA()} color="warning" />}
                    label={<Typography variant="body2" fontWeight="600">{user?.isAuthenticated2Fa ? t("2FA Enabled") : t("2FA Disabled")}</Typography>}
                  />
                  <FormControlLabel
                    control={<Switch checked={user.isVerified} onChange={() => handleEnableOrDisableVerifyEmail()} color="warning" />}
                    label={<Typography variant="body2" fontWeight="600">{user?.isVerified ? t("Email Verified") : t("Email Unverified")}</Typography>}
                  />
                  <FormControlLabel
                    control={<Switch checked={user.isVerified} onChange={() => handleEnableOrDisableVerifyPhone()} color="warning" />}
                    label={<Typography variant="body2" fontWeight="600">{user?.isVerified ? t("Phone Verified") : t("Phone Unverified")}</Typography>}
                  />
                </Stack>
              </Box>

              {/* Editable User Info Title */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="800" sx={{ color: "#3e2723" }}>
                  {t("Personal Information")}
                </Typography>
                <Button 
                  startIcon={<EditIcon />} 
                  onClick={handleEditToggle} 
                  sx={{ color: '#ff9800', fontWeight: "700" }}
                >
                  {isEditing ? t("Cancel Edit") : t("Edit Details")}
                </Button>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label={t("Name")}
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t("Email")}
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t("Phone")}
                    name="phone"
                    value={editedUser.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t("Address")}
                    name="address"
                    value={editedUser.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              {/* Save Button */}
              {isEditing && (
                <Stack direction="row" justifyContent="flex-end" mt={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                  >
                    {t("Save")}
                  </Button>
                </Stack>
              )}
            </Box>
          )}

          {/* Actions */}
          {/* Actions */}
          <Box mt={6} pt={4} sx={{ borderTop: "1px dashed #e0e0e0" }}>
            <Typography variant="h6" fontWeight="800" sx={{ color: "#3e2723", mb: 3 }}>
              {t("Quick Links")}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ReceiptIcon />}
                  onClick={() => navigate(`${user?._id}/orders?page=1`)}
                  sx={{ bgcolor: "#4caf50", color: "#fff", py: 1.5, "&:hover": { bgcolor: "#388e3c" } }}
                >
                  {t("My Orders")}
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Favorite />}
                  onClick={() => navigate(`${user?._id}/favoritelist?page=1`)}
                  sx={{ bgcolor: "#e91e63", color: "#fff", py: 1.5, "&:hover": { bgcolor: "#c2185b" } }}
                >
                  {t("Favorites")}
                </Button>
              </Grid>
              {user?.role.name === "Admin" && (
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AdminPanelSettings />}
                    onClick={() => navigate(`/admin-dashboard`)}
                    sx={{ bgcolor: "#2196f3", color: "#fff", py: 1.5, "&:hover": { bgcolor: "#1976d2" } }}
                  >
                    {t("Dashboard")}
                  </Button>
                </Grid>
              )}
              <Grid item xs={12} sm={user?.role.name === "Admin" ? 12 : 4}>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  startIcon={<LogoutIcon />}
                  onClick={handleLogOut}
                  sx={{ py: 1.5 }}
                >
                  {t("Logout")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserInfo;
