import React, { useState, useEffect } from "react"; 
import axios from "axios";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import { MdOutlineArrowDropDown, MdEdit } from "react-icons/md";
import "./Value.css";

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
    data.append('heading', formData.heading);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('subheading1', formData.subheading1);
    data.append('description1', formData.description1);
    data.append('subheading2', formData.subheading2);
    data.append('description2', formData.description2);
    data.append('subheading3', formData.subheading3);
    data.append('description3', formData.description3);

    const fileInput = e.target.imageUrl.files[0];
    if (fileInput) {
      data.append('imageUrl', fileInput);
    }

    try {
      await axios.post('http://localhost:3000/api/values/edit', data, {
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
        Heading
        <input type="text" name="heading" value={formData.heading} onChange={handleChange} />
      </label>
      <label>
        Title
        <input type="text" name="title" value={formData.title} onChange={handleChange} />
      </label>
      <label>
        Description
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </label>
      <label>
        Subheading 1
        <input type="text" name="subheading1" value={formData.subheading1} onChange={handleChange} />
      </label>
      <label>
        Description 1
        <textarea name="description1" value={formData.description1} onChange={handleChange} />
      </label>
      <label>
        Subheading 2
        <input type="text" name="subheading2" value={formData.subheading2} onChange={handleChange} />
      </label>
      <label>
        Description 2
        <textarea name="description2" value={formData.description2} onChange={handleChange} />
      </label>
      <label>
        Subheading 3
        <input type="text" name="subheading3" value={formData.subheading3} onChange={handleChange} />
      </label>
      <label>
        Description 3
        <textarea name="description3" value={formData.description3} onChange={handleChange} />
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

const Value = ({ isAdmin }) => {
  const [values, setValues] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState({});

  useEffect(() => {
    fetchValues();
  }, []);

  const fetchValues = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/values');
      setValues(res.data);
    } catch (error) {
      console.log('Error fetching values:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedValue(values[0]); // Assuming you're editing the first value
  };

  const handleSave = (updatedValue) => {
    setValues(prevValues => 
      prevValues.map(value => value.id === updatedValue.id ? updatedValue : value)
    );
  };

  const toggleAccordion = (index) => {
    setExpandedItems(prev => 
      prev.includes(index) ? prev.filter(item => item !== index) : [...prev, index]
    );
  };

  return (
    <section id="value" className="v-wrapper">
      <div className="paddings innerWidth flexCenter v-container">
        {/* Left Side */}
        <div className="v-left">
          <div className="image-container">
            <img src={`http://localhost:3000/${values[0]?.imageUrl || 'default-image.jpg'}`} alt="Values" />
          </div>
        </div>

        {/* Right Side */}
        <div className="flexColStart v-right">
          <span className="orangeText">{values[0]?.heading || 'Our Values'}</span>
          <span className="primaryText">{values[0]?.title || 'Our Values'}</span>
          <span className="secondaryText">{values[0]?.description || 'Our Values'}</span>

          {/* Edit Button for Admin */}
          {isAdmin && (
            <div className="edit-container">
              <button onClick={handleEdit} className="edit-button">
                Edit Contact Information
              </button>
            </div>
          )}

          {/* Edit Popup */}
          {isEditing && (
            <EditContactPopup
              contact={editedValue}
              onClose={() => setIsEditing(false)}
              onSave={handleSave}
            />
          )}

          {/* Accordion */}
          <Accordion className="accordion" allowMultipleExpanded={false}>
            {values.length > 0 && ['subheading1', 'subheading2', 'subheading3'].map((subheading, index) => {
              const description = `description${index + 1}`;
              return (
                <AccordionItem
                  className={`accordionItem ${expandedItems.includes(index) ? 'expanded' : 'collapsed'}`}
                  uuid={index}
                  key={index}
                >
                  <AccordionItemHeading>
                    <AccordionItemButton className="flexCenter accordionButton" onClick={() => toggleAccordion(index)}>
                      <AccordionItemState>
                        {({ expanded }) => (
                          <>
                            <div className="flexCenter icon">
                              <MdOutlineArrowDropDown size={20} />
                            </div>
                            <span className="primaryText">
                              {values[0]?.[subheading] || `Default Subheading ${index + 1}`}
                            </span>
                            <div className="flexCenter icon">
                              <MdOutlineArrowDropDown size={20} />
                            </div>
                          </>
                        )}
                      </AccordionItemState>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <p className="secondaryText">
                      {values[0]?.[description] || `Default Description ${index + 1}`}
                    </p>
                  </AccordionItemPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Value;
