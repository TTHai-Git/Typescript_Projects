import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router';
import { logout } from '../features/login/authSlice';
// import axios from 'axios';

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
import { Favorite } from '@mui/icons-material';

const UserInfo = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

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
  }, [user, navigate]);

  const handleLogOut = () => {
    dispatch(logout());
    navigate('/login');
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
      // const res = await axios.put(
      //   `/v1/users/${user?._id}/update-infor`,
      //   {
      //     name: editedUser.name,
      //     email: editedUser.email,
      //     phone: editedUser.phone,
      //     address: editedUser.address
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${user?.tokenInfo.accessToken}`
      //     }
      //   }
      // );

      let url = `${endpoints['updateInfor'](user?._id)}`
      const res = await authApi(user?.tokenInfo.accessToken).put(url, {
        name: editedUser.name,
        email: editedUser.email,
        phone: editedUser.phone,
        address: editedUser.address
      });

      if (res.status === 200) {
        alert("Saving user data successfully...");
        setIsEditing(false);
        handleLogOut();
      }
    } catch (err: any) {
      console.error("Update failed", err);
      alert("Error saving user data: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f0f2f5" p={2}>
      <Card sx={{ maxWidth: 600, width: '100%', borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" fontWeight={600}>
              User Information
            </Typography>
            <IconButton onClick={handleEditToggle} size="small">
              <EditIcon color="primary" />
            </IconButton>
          </Stack>

          {user && (
            <Box>
              <Stack alignItems="center" mb={3}>
                <Avatar
                  src={user.avatar}
                  alt="User Avatar"
                  sx={{ width: 100, height: 100, mb: 1 }}
                />
                <Typography variant="subtitle1">{editedUser.name}</Typography>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
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
                    label="Email"
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
                    label="Phone"
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
                    label="Address"
                    name="address"
                    value={editedUser.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              {isEditing && (
                <Stack direction="row" justifyContent="flex-end" mt={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </Stack>
              )}
            </Box>
          )}

          <Stack direction="row" spacing={2} mt={4} justifyContent="space-between">
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              fullWidth
              onClick={handleLogOut}
            >
              Logout
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ReceiptIcon />}
              fullWidth
              onClick={() => navigate(`${user?._id}/orders/1`)}
            >
              Follow Orders
            </Button>
            <Button
              variant="contained"
              color="info"
              startIcon={<Favorite />}
              fullWidth
              onClick={() => navigate(`${user?._id}/favoritelist?page=1`)}
            >
              Follow Favoritelist
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserInfo;
