import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router';
import { logout } from '../features/login/authSlice';
import '../Assets/CSS/UserInfo.css';

const UserInfo = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

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
        <button className="logout-button" onClick={handleLogOut}>Logout</button>
      </div>
    </div>
  );
};

export default UserInfo;
