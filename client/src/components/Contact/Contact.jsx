import React, { useState, useEffect } from "react";
import "./Contact.css";
import { MdCall } from "react-icons/md";
import { BsFillChatDotsFill } from "react-icons/bs";
import { HiChatBubbleBottomCenter } from 'react-icons/hi2';
import axios from 'axios';

// Popup component for editing contact information
const EditContactPopup = ({ contact, onClose, onSave }) => {
  const [formData, setFormData] = useState(contact);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('call', formData.call);
    data.append('message', formData.message);
    data.append('chat', formData.chat);
    data.append('videocall', formData.videocall);

    const fileInput = e.target.imageUrl.files[0];
    if (fileInput) {
      data.append('imageUrl', fileInput);
    }

    try {
      await axios.post('http://localhost:3000/api/contactus/edit', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSave(formData); // Pass the updated data to parent
      onClose(); // Close the popup
    } catch (error) {
      console.error('Error saving contact data:', error);
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Edit Contact Information</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input type="text" name="title" value={formData.title} onChange={handleChange} />
          </label>
          <label>
            Description:
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </label>
          <label>
            Call:
            <input type="text" name="call" value={formData.call} onChange={handleChange} />
          </label>
          <label>
            Chat:
            <input type="text" name="chat" value={formData.chat} onChange={handleChange} />
          </label>
          <label>
            Video Call:
            <input type="text" name="videocall" value={formData.videocall} onChange={handleChange} />
          </label>
          <label>
            Message:
            <input type="text" name="message" value={formData.message} onChange={handleChange} />
          </label>
          <label>Image:</label>
          <input type="file" name="imageUrl" accept="image/*" />
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose} className="cancel">Cancel</button>
        </form>
      </div>
    </div>
  );
};

// Contact component 
const Contact = ({ isAdmin }) => {
  const [contacts, setContacts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/contactus');
      setContacts(res.data);
    } catch (error) {
      console.log('Error fetching contact data:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedContact) => {
    fetchContacts(); // Re-fetch contacts to ensure the latest data is shown
  };

  return (
    <div id="contact-us" className="c-wrapper">
      <div className="paddings innerWidth flexCenter c-container">
        <div className="flexColStart c-left">
          <span className="orangeText">Our Contact Us</span>
          <span className="primaryText">{contacts[0]?.title || 'Contact Us'}</span>
          <span className="secondaryText">
            {contacts[0]?.description || 'Please reach out to us with any inquiries.'}
          </span>
          <div className="flexColStart contactModes">
            <div className="flexStart row">
              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <MdCall size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">Call</span>
                    <span className="secondaryText">{contacts[0]?.call || 'N/A'}</span>
                  </div>
                </div>
                <div className="flexCenter button">Call now</div>
              </div>
              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <BsFillChatDotsFill size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">Chat</span>
                    <span className="secondaryText">{contacts[0]?.chat || 'N/A'}</span>
                  </div>
                </div>
                <div className="flexCenter button">Chat now</div>
              </div>
            </div>
            <div className="flexStart row">
              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <BsFillChatDotsFill size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">Video Call</span>
                    <span className="secondaryText">{contacts[0]?.videocall || 'N/A'}</span>
                  </div>
                </div>
                <div className="flexCenter button">Video Call now</div>
              </div>
              <div className="flexColCenter mode">
                <div className="flexStart">
                  <div className="flexCenter icon">
                    <HiChatBubbleBottomCenter size={25} />
                  </div>
                  <div className="flexColStart detail">
                    <span className="primaryText">Message</span>
                    <span className="secondaryText">{contacts[0]?.message || 'N/A'}</span>
                  </div>
                </div>
                <div className="flexCenter button">Message now</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flexEnd c-right">
          <div className="image-container">
            <img
              src={`http://localhost:3000/${contacts[0]?.imageUrl || 'default-image.jpg'}`}
              alt="Contact"
            />
          </div>
        </div>
      </div>
      {isAdmin && (
        <div className="edit-container">
          <button onClick={handleEdit} className="edit-button">
            Edit Contact Information
          </button>
        </div>
      )}
      {isEditing && (
        <EditContactPopup
          contact={contacts[0]}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Contact;
