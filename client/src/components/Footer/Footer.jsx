import React, { useState, useEffect } from "react";
import "./Footer.css";
import axios from 'axios';

const Footer = ({ setIsAdmin }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAdmin, setIsAdminLocal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAdminLocal(true);
      setIsAdmin(true);
    }
  }, [setIsAdmin]);

  const toggleLoginForm = () => setShowLoginForm(!showLoginForm);
  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/admin/login', { username, password });
      if (res.data.success) {
        setIsAdminLocal(true);
        setIsAdmin(true);
        localStorage.setItem('token', res.data.token);
        setShowLoginForm(false);
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.log(error);
      alert('Login failed');
    }
  };
  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdminLocal(false);
    setIsAdmin(false);
    alert('Logged out successfully');
  };

  return (
    <div className="f-wrapper">
      <div className="paddings innerWidth flexCenter f-container">
        <div className="flexColStart f-left">
          <img src="./logo2.png" alt="" width={120} />
          <span className="secondaryText">
            Our vision is to make all people <br />
            the best place to live for them.
          </span>
        </div>

        <div className="flexColStart f-right">
          <span className="primaryText">Information</span>
          <span className="secondaryText">145 New York, FL 5467, USA</span>
          <div className="flexCenter f-menu">
            <span>Property</span>
            <span>Services</span>
            <span>Product</span>
            <span>About Us</span>
            
            {!isAdmin && (
              <button onClick={toggleLoginForm} className="admin-button">
                Admin Login
              </button>
            )}
            {isAdmin && (
              <>
                <button className="edit-button">Edit Content</button>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Login Form */}
      {showLoginForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleLoginForm}>&times;</span>
            <h3>Admin Login</h3>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
