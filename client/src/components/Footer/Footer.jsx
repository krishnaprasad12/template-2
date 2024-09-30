import React, { useState, useEffect } from "react";
import "./Footer.css";
import axios from 'axios';

// Popup component for editing Footer section
const EditFooterPopup = ({ footerData, onClose, onSave }) => {
  const [formData, setFormData] = useState(footerData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new URLSearchParams();
    data.append("description", formData.description);
    data.append("address", formData.address); // Add other fields as necessary

    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      const response = await axios.post("http://localhost:3000/api/footer/edit", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': `Bearer ${token}` // Include token in the headers
        },
      });
      console.log("Response:", response.data);
      onSave(formData); // Pass updated data to the parent
      onClose(); // Close the popup
    } catch (error) {
      console.error("Error saving Footer data:", error);
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Edit Footer Information</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Description
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Address
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose} className="cancel">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

const Footer = ({ setIsAdmin }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAdmin, setIsAdminLocal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [footer, setFooter] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFooter, setEditedFooter] = useState({});

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/footer");
      setFooter(res.data);
    } catch (error) {
      console.log("Error fetching Footer data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAdminLocal(true);
      setIsAdmin(true);

    }
  }, [setIsAdmin]);

  const toggleLoginForm = () => setShowLoginForm(!showLoginForm);

  const autoLogout = async() => {
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!expiry) {
        // If there's no expiry time set, log out immediately
        logout();
        return;
    }

    const currentTime = new Date().getTime();
    const timeout = expiry - currentTime;

    if (timeout > 0) {
        setTimeout(() => {
            logout(); // Call your logout function when the token expires
        }, timeout);
    } else {
        logout(); // Token already expired, log out immediately
    }
  }

  const logout= async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        alert('Session expired. You have been logged out.');
        window.location.href = '/'; // Redirect to login page
  }

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/admin/login', { username, password });
      if (res.data.success) {
        setIsAdminLocal(true);
        setIsAdmin(true);
        localStorage.setItem('token', res.data.token);
        const decodedToken = JSON.parse(atob(res.data.token.split('.')[1])); // Decode the JWT payload
        const tokenExpiry = decodedToken.exp * 1000; // Convert expiration time to milliseconds
        localStorage.setItem('tokenExpiry', tokenExpiry);
        setShowLoginForm(false);  // Close the login form upon successful login
        autoLogout();
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedFooter(footer[0]); // Assuming you're editing the first entry
  };

  const handleSave = (updatedFooter) => {
    setFooter([updatedFooter]); // Update footer state with the edited data
  };

  return (
    <div className="f-wrapper">
      <div className="paddings innerWidth flexCenter f-container">
        <div className="flexColStart f-left">
          <img src="./logo.png" alt="" width={90} />
          <span className="secondaryText">
            {footer[0]?.description || "Our description"}
          </span>
        </div>

        <div className="flexColStart f-right">
          <span className="primaryText">Address</span>
          <span className="secondaryText">{footer[0]?.address || "Our address"}</span>
          <div className="flexCenter f-menu">
            {!isAdmin && (
              <button onClick={toggleLoginForm} className="admin-button">
                Admin Login
              </button>
            )}
            {isAdmin && (
              <>
                <button onClick={handleEdit} className="edit-button">Edit Content</button>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Popup */}
      {isEditing && (
        <EditFooterPopup
          footerData={editedFooter}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}

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
