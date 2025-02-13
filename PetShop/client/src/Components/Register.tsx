import React, { useState } from "react";
import "../Assets/CSS/Register.css";
import axios from "axios";
import { useNavigate } from "react-router";


const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userRegister, setUserRegister] = useState({
    id: Math.floor(Math.random() * 100) + 1, // Generate a random integer between 1 and 100
    username: "",
    password: "",
    avatar: null as File | null,
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleSetState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files.length > 0) {
      setUserRegister((prev) => ({ ...prev, avatar: files[0] }));
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
    data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET );
    data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);

    try {
      const res_1 = await axios.post(
        "https://api.cloudinary.com/v1_1/dh5jcbzly/image/upload", data);
      console.log(res_1);
      userRegister.avatar = res_1.data.secure_url;

      const res_2 = await axios.post('/api/auth/register', userRegister);
      console.log(res_2);
      if (res_2.status === 201) {
        navigate('/login');
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {loading && <div className="loading-spinner"></div>}
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Register Account</h2>

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your username..."
          required
          value={userRegister.username}
          onChange={handleSetState}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password..."
          required
          value={userRegister.password}
          onChange={handleSetState}
        />

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name..."
          required
          value={userRegister.name}
          onChange={handleSetState}
        />

        <label>Avatar:</label>
        <input type="file" name="avatar" accept="image/*" onChange={handleSetState} />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email..."
          required
          value={userRegister.email}
          onChange={handleSetState}
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Enter your phone..."
          required
          value={userRegister.phone}
          onChange={handleSetState}
        />

        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          placeholder="Enter your address..."
          required
          value={userRegister.address}
          onChange={handleSetState}
        />

        <button type="submit" disabled={loading}>Register</button>
      </form>
    </div>
  );
};

export default Register;
