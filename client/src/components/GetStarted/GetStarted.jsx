import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GetStarted.css";

// Popup component for editing Get Started section
const EditGetStartedPopup = ({ startData, onClose, onSave }) => {
  const [formData, setFormData] = useState(startData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Use x-www-form-urlencoded format
    const data = new URLSearchParams();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("url", formData.url);

    try {
      const response = await axios.post("http://localhost:3000/api/start/edit", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log("Response:", response.data);
      onSave(formData); // Pass updated data to the parent
      onClose(); // Close the popup
    } catch (error) {
      console.error("Error saving Get Started data:", error);
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Edit Get Started Information</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            URL
            <input
              type="text"
              name="url"
              value={formData.url || ""}
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

const GetStarted = ({ isAdmin }) => {
  const [start, setStart] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStart, setEditedStart] = useState({});

  useEffect(() => {
    fetchStart();
  }, []);

  const fetchStart = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/start");
      setStart(res.data);
    } catch (error) {
      console.log("Error fetching Get Started data:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedStart(start[0]); // Assuming you're editing the first entry
  };

  const handleSave = (updatedStart) => {
    setStart((prevStart) => {
      const updatedList = [...prevStart];
      const index = updatedList.findIndex(item => item.id === updatedStart.id); // Ensure to find the right entry
      if (index !== -1) {
        updatedList[index] = updatedStart;
      }
      return updatedList;
    });
  };

  return (
    <div id="get-started" className="g-wrapper">
      <div className="paddings innerWidth g-container">
        <div className="flexColCenter inner-container">
          <span className="primaryText">
            {start[0]?.title || "Our Title"}
          </span>
          <span className="secondaryText">
            {start[0]?.description || "Our Description"}
          </span>
          <button className="button">
            <a
              href={start[0]?.url || "Our url"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Started
            </a>
          </button>

          {/* Admin Edit Button */}
          {isAdmin && (
            <div className="edit-container">
              <button onClick={handleEdit} className="edit-button">
                Edit Get Started Information
              </button>
            </div>
          )}

          {/* Edit Popup */}
          {isEditing && (
            <EditGetStartedPopup
              startData={editedStart}
              onClose={() => setIsEditing(false)}
              onSave={handleSave}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
