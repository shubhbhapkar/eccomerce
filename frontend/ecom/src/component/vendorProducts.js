// import React, { useState,useEffect } from 'react';
// import axios from 'axios';

// const CreateProductForm = () => {
//   const [categories,setCategories] = useState("")

//   useEffect(()=>{
//     const getCategories = () =>{
//       const response = axios.get("http://127.0.0.1:8000/user/categories/",{
//           withCredentials:true
//       })
//       .then(response=>{console.log(response.data) 
//           setCategories(response.data)
          
//       })
//       .catch(error =>{console.log(error)});
//   }
//     getCategories();
//   },[])

 
  
//   const [formData, setFormData] = useState({
//     productname: '',
//     productbrand: '',
//     description: '',
//     price: '',
//     category: '',
//     stock_quantity: '',
//     rating: '',
//     discount: '',
//     product_colors: [
//       { color: '', image: null },
//     ],
//   });

//   // Handle input changes for text fields
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Handle input changes for color and image fields
//   const handleColorChange = (index, field, value) => {
//     const updatedColors = [...formData.product_colors];
//     updatedColors[index][field] = value;
//     setFormData((prevState) => ({
//       ...prevState,
//       product_colors: updatedColors,
//     }));
//   };

//   // Handle image file change for color
//   const handleFileChange = (e, index) => {
//     const file = e.target.files[0];
//     handleColorChange(index, 'image', file);
//   };

//   // Add a new color input field
//   const addColorField = () => {
//     setFormData((prevState) => ({
//       ...prevState,
//       product_colors: [...prevState.product_colors, { color: '', image: null }],
//     }));
//   };

//   // Remove an existing color input field
//   const removeColorField = (index) => {
//     const updatedColors = formData.product_colors.filter((_, i) => i !== index);
//     setFormData((prevState) => ({
//       ...prevState,
//       product_colors: updatedColors,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Create FormData to send as multipart/form-data
//     const form = new FormData();
//     form.append('productname', formData.productname);
//     form.append('productbrand', formData.productbrand);
//     form.append('description', formData.description);
//     form.append('price', formData.price);
//     form.append('category', formData.category);
//     form.append('stock_quantity', formData.stock_quantity);
//     form.append('rating', formData.rating);
//     form.append('discount', formData.discount);

//     // Add color information and corresponding image to FormData
//     formData.product_colors.forEach((color, index) => {
//       form.append(`product_colors[${index}]color`, color.color);
//       form.append(`product_colors[${index}]image`, color.image);
//     });

//     try {
//       const response = await fetch('http://localhost:8000/user/addProduct/', {
//         method: 'POST',
//         headers: {
//           'X-CSRFToken': getCSRFToken(), // Add CSRF token if needed
//         },
//         body: form,
//         credentials: 'include',
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         console.error('Error:', data);
//         alert('Failed to create the product.');
//       } else {
//         console.log('Product created successfully!', data);
//         alert('Product created successfully!');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Something went wrong. Please try again.');
//     }
//   };

//   // Helper function to get CSRF token from cookies (if using Django with CSRF protection)
//   const getCSRFToken = () => {
//     const cookies = document.cookie.split('; ');
//     const csrfCookie = cookies.find(row => row.startsWith('csrftoken='));
//     return csrfCookie ? csrfCookie.split('=')[1] : '';
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Create Product</h2>
//       <form onSubmit={handleSubmit} encType="multipart/form-data">
//         <div className="mb-3">
//           <label htmlFor="productname" className="form-label">
//             Product Name
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="productname"
//             name="productname"
//             value={formData.productname}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="productbrand" className="form-label">
//             Product Brand
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="productbrand"
//             name="productbrand"
//             value={formData.productbrand}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="description" className="form-label">
//             Description
//           </label>
//           <textarea
//             className="form-control"
//             id="description"
//             name="description"
//             rows="3"
//             value={formData.description}
//             onChange={handleInputChange}
//           ></textarea>
//         </div>
//         <div className="mb-3">
//           <label htmlFor="price" className="form-label">
//             Price
//           </label>
//           <input
//             type="number"
//             className="form-control"
//             id="price"
//             name="price"
//             value={formData.price}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="category" className="form-label">
//             Category ID
//           </label>
//           <input
//             type="number"
//             className="form-control"
//             id="category"
//             name="category"
//             value={formData.category}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="stock_quantity" className="form-label">
//             Stock Quantity
//           </label>
//           <input
//             type="number"
//             className="form-control"
//             id="stock_quantity"
//             name="stock_quantity"
//             value={formData.stock_quantity}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="rating" className="form-label">
//             Rating
//           </label>
//           <input
//             type="number"
//             step="0.1"
//             className="form-control"
//             id="rating"
//             name="rating"
//             value={formData.rating}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="discount" className="form-label">
//             Discount (%)
//           </label>
//           <input
//             type="number"
//             step="0.01"
//             className="form-control"
//             id="discount"
//             name="discount"
//             value={formData.discount}
//             onChange={handleInputChange}
//           />
//         </div>

//         <h4>Product Colors</h4>
//         {formData.product_colors.map((color, index) => (
//           <div key={index} className="mb-3">
//             <div className="input-group">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Color"
//                 value={color.color}
//                 onChange={(e) => handleColorChange(index, 'color', e.target.value)}
//                 required
//               />
//               <input
//                 type="file"
//                 className="form-control"
//                 onChange={(e) => handleFileChange(e, index)}
//                 required
//               />
//               <button
//                 type="button"
//                 className="btn btn-danger"
//                 onClick={() => removeColorField(index)}
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         ))}

//         <button
//           type="button"
//           className="btn btn-secondary mb-3"
//           onClick={addColorField}
//         >
//           Add Color
//         </button>
//         <button type="submit" className="btn btn-success w-100 mb-2">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateProductForm;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './vendorNavbar';
const CreateProductForm = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([]); // Update: Array to store categories

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/user/categories/", {
          withCredentials: true,
        });
        setCategories(response.data); // Update: Set categories from API response
      } catch (error) {
        console.error(error);
      }
    };
    getCategories();
  }, []);

  const [formData, setFormData] = useState({
    productname: '',
    productbrand: '',
    description: '',
    price: '',
    category: '', // This will hold the selected category ID
    stock_quantity: '',
    rating: '',
    discount: '',
    product_colors: [{ color: '', image: null }],
  });

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle input changes for color and image fields
  const handleColorChange = (index, field, value) => {
    const updatedColors = [...formData.product_colors];
    updatedColors[index][field] = value;
    setFormData((prevState) => ({
      ...prevState,
      product_colors: updatedColors,
    }));
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    handleColorChange(index, 'image', file);
  };

  const addColorField = () => {
    setFormData((prevState) => ({
      ...prevState,
      product_colors: [...prevState.product_colors, { color: '', image: null }],
    }));
  };

  const removeColorField = (index) => {
    const updatedColors = formData.product_colors.filter((_, i) => i !== index);
    setFormData((prevState) => ({
      ...prevState,
      product_colors: updatedColors,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const form = new FormData();
    form.append('productname', formData.productname);
    form.append('productbrand', formData.productbrand);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('category', formData.category); // Send the selected category ID
    form.append('stock_quantity', formData.stock_quantity);
    form.append('rating', formData.rating);
    form.append('discount', formData.discount);

    formData.product_colors.forEach((color, index) => {
      form.append(`product_colors[${index}]color`, color.color);
      form.append(`product_colors[${index}]image`, color.image);
    });
console.log(formData)
    try {
      const response = await fetch('http://localhost:8000/user/addProduct/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': getCSRFToken(),
        },
        body: form,
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Error:', data);
        alert('Failed to create the product.');
      } else {
        console.log('Product created successfully!', data);
        alert('Product created successfully!');
        navigate("/vendorproduct")
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const getCSRFToken = () => {
    const cookies = document.cookie.split('; ');
    const csrfCookie = cookies.find(row => row.startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] : '';
  };

  return (
    <>
    <div className='d-flex'>
      <Navbar/>
    <div className="container mt-5">
      <h2 className='text-success'>Create Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="productname" className="form-label">
            Product Name
          </label>
          <input
            type="text"
            className="form-control"
            id="productname"
            name="productname"
            value={formData.productname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="productbrand" className="form-label">
            Product Brand
          </label>
          <input
            type="text"
            className="form-control"
            id="productbrand"
            name="productbrand"
            value={formData.productbrand}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            className="form-select"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="stock_quantity" className="form-label">
            Stock Quantity
          </label>
          <input
            type="number"
            className="form-control"
            id="stock_quantity"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="rating" className="form-label">
            Rating
          </label>
          <input
            type="number"
            step="0.1"
            className="form-control"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="discount" className="form-label">
            Discount (%)
          </label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
          />
        </div>

        <h4>Product Colors</h4>
        {formData.product_colors.map((color, index) => (
          <div key={index} className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Color"
                value={color.color}
                onChange={(e) => handleColorChange(index, 'color', e.target.value)}
                required
              />
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleFileChange(e, index)}
                required
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeColorField(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={addColorField}
        >
          Add Color
        </button>
        <button type="submit" className="btn btn-success w-100 mb-2">
          Submit
        </button>
      </form>
    </div>
    </div>
    </>
  );
};

export default CreateProductForm;
