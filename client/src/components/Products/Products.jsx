import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "./Products.css";
import { sliderSettings } from "../../utils/common";

// Popup component for editing product information
const EditProductPopup = ({ productData, onClose, onSave }) => {
  const [formData, setFormData] = useState(productData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [`imageUrl${index}`]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('heading', formData.heading);
    data.append('title', formData.title);

    // Loop through products 1 to 6 and append corresponding fields
    for (let i = 1; i <= 6; i++) {
      data.append(`name${i}`, formData[`name${i}`]);
      data.append(`description${i}`, formData[`description${i}`]);
      data.append(`price${i}`, formData[`price${i}`]);
      if (formData[`imageUrl${i}`] instanceof File) {
        data.append(`imageUrl${i}`, formData[`imageUrl${i}`]);
      }
    }

    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      await axios.post('http://localhost:3000/api/products/edit', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Include token in the headers
        },
      });
      onSave(formData); // Pass the updated data to parent
      onClose(); // Close the popup
    } catch (error) {
      console.error('Error saving product data:', error);
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Edit Product Information</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Heading
            <input type="text" name="heading" value={formData.heading} onChange={handleChange} />
          </label>
          <label>
            Title
            <input type="text" name="title" value={formData.title} onChange={handleChange} />
          </label>

          {[...Array(6)].map((_, index) => (
            <div key={index}>
              <h3>Product {index + 1}</h3>
              <label>
                Name
                <input type="text" name={`name${index + 1}`} value={formData[`name${index + 1}`]} onChange={handleChange} />
              </label>
              <label>
                Description
                <textarea name={`description${index + 1}`} value={formData[`description${index + 1}`]} onChange={handleChange} />
              </label>
              <label>
                Price
                <input type="number" name={`price${index + 1}`} value={formData[`price${index + 1}`]} onChange={handleChange} />
              </label>
              <label>
                Image
                <input
                  type="file"
                  name={`imageUrl${index + 1}`}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, index + 1)}
                />
              </label>
            </div>
          ))}

          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose} className="cancel">Cancel</button>
        </form>
      </div>
    </div>
  );
};

const Products = ({ isAdmin }) => {
  const [products, setProduct] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/products');
      setProduct(res.data);
      if (res.data.length > 0) {
        setEditedProduct(res.data[0]); // Initialize edited product with the first product
      }
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditedProduct(product);
  };

  const handleSave = (updatedProduct) => {
    const updatedProducts = products.map((prod) =>
      prod._id === updatedProduct._id ? updatedProduct : prod
    );
    setProduct(updatedProducts);
  };

  return (
    <div id="products" className="r-wrapper">
      <div className="paddings innerWidth r-container">
        <div className="flexColStart r-head">
          <span className="orangeText">{products[0]?.heading || 'Our Heading'}</span>
          <span className="primaryText">{products[0]?.title || 'Our Title'}</span>
        </div>

        {/* Admin Edit Button */}
        {isAdmin && (
          <div className="edit-container">
            <button onClick={() => handleEdit(products[0])} className="edit-button">
              Edit Product Information
            </button>
          </div>
        )}

        <Swiper {...sliderSettings}>
          <SlideNextButton />
          {/* slider */}
          {Array.from({ length: 6 }).map((_, index) => (
            <SwiperSlide key={index}>
              <div className="flexColStart r-card">
                <img
                  src={`http://localhost:3000/${products[0]?.[`imageUrl${index + 1}`] || 'default-image.jpg'}`}
                  alt={products[0]?.[`name${index + 1}`] || 'product'}
                />

                <span className="secondaryText r-price">
                  <span style={{ color: "orange" }}>₹</span>
                  <span>{products[0]?.[`price${index + 1}`] || '0.00'}</span>
                </span>
                <span className="primaryText">
                  {products[0]?.[`name${index + 1}`] || 'Product Name'}
                </span>
                <span className="secondaryText" style={{ fontSize: '14px' }} >
                  {products[0]?.[`description${index + 1}`] || 'Product Description'}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>


        {/* Edit Popup */}
        {isEditing && (
          <EditProductPopup
            productData={editedProduct}
            onClose={() => setIsEditing(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default Products;

const SlideNextButton = () => {
  const swiper = useSwiper();
  return (
    <div className="flexCenter r-buttons">
      <button onClick={() => swiper.slidePrev()} className="r-prevButton">
        &lt;
      </button>
      <button onClick={() => swiper.slideNext()} className="r-nextButton">
        &gt;
      </button>
    </div>
  );
};
