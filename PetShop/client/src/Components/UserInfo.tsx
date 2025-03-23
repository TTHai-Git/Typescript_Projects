import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router';
import { logout } from '../features/login/authSlice';
import '../Assets/CSS/UserInfo.css';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptIcon from '@mui/icons-material/Receipt';

const UserInfo = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="user-info-container">
      <div className="user-info-box">
        <h1>User Information</h1>
        {user && (
          <div className="user-details">
            <img src={user.avatar} alt="User Avatar" className="user-avatar" />
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Address:</strong> {user.address}</p>
            
            
          </div>
        )}
        <div className='user-info-buttons'>
          <button className="logout-button" onClick={handleLogOut}> <LogoutIcon/> Logout </button>
          <button className="follow-button" onClick={() => navigate(`${user?._id}/orders/1`)}><ReceiptIcon/> Follow Orders </button>
        </div>
        
      </div>
    </div>
  );
};

export default UserInfo;
