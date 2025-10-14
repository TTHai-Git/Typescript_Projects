import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useLocation, useNavigate } from 'react-router';
import { logout } from '../features/login/authSlice';
import { Chip, Tooltip } from '@mui/material';
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
import { AdminPanelSettings, Favorite } from '@mui/icons-material';
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
    // console.log("user", user)
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
  }, [user, navigate]);

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
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f0f2f5"
      p={2}
    >
      <Card sx={{ maxWidth: 600, width: "100%", borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="h5" fontWeight={600}>
              {t("User Information")}
            </Typography>
            <IconButton onClick={handleEditToggle} size="small">
              <EditIcon color="primary" />
            </IconButton>
          </Stack>

          {/* User Content */}
          {user && (
            <Box>
              <Stack alignItems="center" mb={3}>
                <Avatar
                  src={user.avatar}
                  alt="User Avatar"
                  sx={{ width: 100, height: 100, mb: 1 }}
                />
                <Typography variant="subtitle1">{user.username}</Typography>

                <Tooltip
                  title={
                    user.isVerified
                      ? t("Your email is verified")
                      : t("Please verify your email")
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

              {/* Editable User Info */}
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
          <Stack
            direction="row"
            spacing={2}
            mt={4}
            justifyContent="space-between"
          >
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              fullWidth
              onClick={handleLogOut}
            >
              {t("Logout")}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ReceiptIcon />}
              fullWidth
              onClick={() =>
               navigate(`${user?._id}/orders?page=1`)
              }
            >
              {t("Follow Orders")}
            </Button>
            <Button
              variant="contained"
              color="info"
              startIcon={<Favorite />}
              fullWidth
              onClick={() =>
                navigate(`${user?._id}/favoritelist?page=1`)
              }
            >
              {t("Follow Favoritelist")}
            </Button>
            {user?.role.name === "Admin" && (
              <Button
                variant="outlined"
                color="warning"
                startIcon={<AdminPanelSettings />}
                fullWidth
                onClick={() =>
                  navigate(`/admin-dashboard`)
                }
                
              >
                {t("Dashboard Management")}
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserInfo;
