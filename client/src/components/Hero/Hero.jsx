import React, { useState, useEffect } from "react"; 
import axios from "axios";
import "./Hero.css";
import { HiLocationMarker } from "react-icons/hi";
import CountUp from "react-countup";
import { motion } from "framer-motion";

// Popup component for editing hero information
const EditHeroPopup = ({ heroData, onClose, onSave }) => {
  const [formData, setFormData] = useState(heroData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('count1', formData.count1);
    data.append('description1', formData.description1);
    data.append('count2', formData.count2);
    data.append('description2', formData.description2);
    data.append('count3', formData.count3);
    data.append('description3', formData.description3);

    const fileInput = e.target.imageUrl.files[0];
    if (fileInput) {
      data.append('imageUrl', fileInput);
    }

    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      await axios.post('http://localhost:3000/api/hero/edit', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Include token in the headers
        },
      });
      onSave(formData); // Pass the updated data to parent
      onClose(); // Close the popup
    } catch (error) {
      console.error('Error saving hero data:', error);
    }
  };

  return ( 
    <div className="popup">
      <div className="popup-content">
        <h2>Edit Hero Information</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input type="text" name="title" value={formData.title} onChange={handleChange} />
          </label>
          <label>
            Description
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </label>
          <label>
            Count 1
            <input type="number" name="count1" value={formData.count1} onChange={handleChange} />
          </label>
          <label>
            Description 1
            <textarea name="description1" value={formData.description1} onChange={handleChange} />
          </label>
          <label>
            Count 2
            <input type="number" name="count2" value={formData.count2} onChange={handleChange} />
          </label>
          <label>
            Description 2
            <textarea name="description2" value={formData.description2} onChange={handleChange} />
          </label>
          <label>
            Image
            <input type="file" name="imageUrl" accept="image/*" />
          </label>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose} className="cancel">Cancel</button>
        </form>
      </div>
    </div>
  );
};

const Hero = ({ isAdmin }) => {
  const [hero, setHero] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHero, setEditedHero] = useState({});

  useEffect(() => {
    fetchHeros();
  }, []);

  const fetchHeros = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/hero');
      setHero(res.data);
    } catch (error) {
      console.log('Error fetching heroes:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedHero(hero[0]); // Assuming you're editing the first hero entry
  };

  const handleSave = (updatedHero) => {
    setHero([updatedHero]);
  };

  return (
    <section className="hero-wrapper">
      <div className="paddings innerWidth flexCenter hero-container">
        {/* left side */}
        <div className="flexColStart hero-left">
          <div className="hero-title">
            <div className="orange-circle" />
            <motion.h1
              initial={{ y: "2rem", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 2,
                type: "ease-in",
              }}
            >
              {hero[0]?.title || 'Our Title'}
            </motion.h1>
          </div>
          <div className="flexColStart secondaryText flexhero-des">
            {hero[0]?.description || 'Our description'}
          </div>

          <div className="flexCenter stats">
            <div className="flexColCenter stat">
              <span>
                <CountUp end={hero[0]?.count1 || 1000} duration={1.25} /> <span>+</span>
              </span>
              <span className="secondaryText">{hero[0]?.description1 || 'Products'}</span>
            </div>

            <div className="flexColCenter stat">
              <span>
                <CountUp end={hero[0]?.count2 || 1000} duration={1.25} /> <span>+</span>
              </span>
              <span className="secondaryText">{hero[0]?.description2 || 'Customers'}</span>
            </div>
          </div>

          {/* Admin Edit Button */}
          {isAdmin && (
            <div className="edit-container">
              <button onClick={handleEdit} className="edit-button">
                Edit Hero Information
              </button>
            </div>
          )}

          {/* Edit Popup */}
          {isEditing && (
            <EditHeroPopup
              heroData={editedHero}
              onClose={() => setIsEditing(false)}
              onSave={handleSave}
            />
          )}
        </div>

        {/* right side */}
        <div className="flexCenter hero-right">
          <motion.div
            initial={{ x: "7rem", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 2,
              type: "ease-in",
            }}
            className="image-container"
          >
            <img src={`http://localhost:3000/${hero[0]?.imageUrl || 'default-image.jpg'}`} alt="Hero" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
