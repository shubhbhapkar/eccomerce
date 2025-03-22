// // import React, { useState, useEffect } from 'react';
// // import { useParams,  } from 'react-router-dom';
// // import axios from 'axios';
// // import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';


// // const UpdateProductForm = () => {
// //   const { id } = useParams();  // Get product ID from URL
// //   // To redirect after deletion
// //   const [formData, setFormData] = useState({
// //     productname: '',
// //     productbrand: '',
// //     description: '',
// //     price: '',
// //     category: '',
// //     stock_quantity: '',
// //     rating: '',
// //     discount: '',
// //     product_colors: [
// //       { color: '', image: null },
// //     ],
// //   });
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchProduct = async () => {
// //       try {
// //         const response = await axios.get(`http://localhost:8000/user/vendorproducts/${id}`);
// //         setFormData(response.data);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching product:', error);
// //         setLoading(false);
// //       }
// //     };

// //     fetchProduct();
// //   }, [id]);

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prevState) => ({
// //       ...prevState,
// //       [name]: value,
// //     }));
// //   };

// //   const handleColorChange = (index, field, value) => {
// //     const updatedColors = [...formData.product_colors];
// //     updatedColors[index][field] = value;
// //     setFormData((prevState) => ({
// //       ...prevState,
// //       product_colors: updatedColors,
// //     }));
// //   };

// //   const handleFileChange = (e, index) => {
// //     const file = e.target.files[0];
// //     handleColorChange(index, 'image', file);
// //   };

// //   const addColorField = () => {
// //     setFormData((prevState) => ({
// //       ...prevState,
// //       product_colors: [...prevState.product_colors, { color: '', image: null }],
// //     }));
// //   };

// //   const removeColorField = (index) => {
// //     const updatedColors = formData.product_colors.filter((_, i) => i !== index);
// //     setFormData((prevState) => ({
// //       ...prevState,
// //       product_colors: updatedColors,
// //     }));
// //   };

// //   const handleUpdate = async (e) => {
// //     e.preventDefault();

// //     const form = new FormData();
// //     form.append('productname', formData.productname);
// //     form.append('productbrand', formData.productbrand);
// //     form.append('description', formData.description);
// //     form.append('price', formData.price);
// //     form.append('category', formData.category);
// //     form.append('stock_quantity', formData.stock_quantity);
// //     form.append('rating', formData.rating);
// //     form.append('discount', formData.discount);

// //     formData.product_colors.forEach((color, index) => {
// //       form.append(`product_colors[${index}]color`, color.color);
// //       form.append(`product_colors[${index}]image`, color.image);
// //     });

// //     try {
// //       const response = await axios.put(`http://localhost:8000/user/updatevendorproducts/${id}`, form, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //         },
// //       });
// //       alert('Product updated successfully!');
// //       console.log(response)
// //     } catch (error) {
// //       console.error('Error updating product:', error);
// //       alert('Failed to update the product.');
// //     }
// //   };

// //   const handleDelete = async () => {
// //     try {
// //       await axios.delete(`http://localhost:8000/products/${id}`);
// //       alert('Product deleted successfully!');
    
// //     } catch (error) {
// //       console.error('Error deleting product:', error);
// //       alert('Failed to delete the product.');
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
// //         <Spinner animation="border" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <Container className="mt-5">
// //       <h2>Update Product</h2>
// //       <Form onSubmit={handleUpdate}>
// //         <Row>
// //           <Col md={6}>
// //             <Form.Group className="mb-3">
// //               <Form.Label>Product Name</Form.Label>
// //               <Form.Control
// //                 type="text"
// //                 name="productname"
// //                 value={formData.productname}
// //                 onChange={handleInputChange}
// //                 required
// //               />
// //             </Form.Group>
// //             <Form.Group className="mb-3">
// //               <Form.Label>Product Brand</Form.Label>
// //               <Form.Control
// //                 type="text"
// //                 name="productbrand"
// //                 value={formData.productbrand}
// //                 onChange={handleInputChange}
// //               />
// //             </Form.Group>
// //             <Form.Group className="mb-3">
// //               <Form.Label>Description</Form.Label>
// //               <Form.Control
// //                 as="textarea"
// //                 name="description"
// //                 rows={3}
// //                 value={formData.description}
// //                 onChange={handleInputChange}
// //               />
// //             </Form.Group>
// //             <Form.Group className="mb-3">
// //               <Form.Label>Price</Form.Label>
// //               <Form.Control
// //                 type="number"
// //                 name="price"
// //                 value={formData.price}
// //                 onChange={handleInputChange}
// //                 required
// //               />
// //             </Form.Group>
// //             <Form.Group className="mb-3">
// //               <Form.Label>Category ID</Form.Label>
// //               <Form.Control
// //                 type="number"
// //                 name="category"
// //                 value={formData.category}
// //                 onChange={handleInputChange}
// //                 required
// //               />
// //             </Form.Group>
// //           </Col>

// //           <Col md={6}>
// //             <Form.Group className="mb-3">
// //               <Form.Label>Stock Quantity</Form.Label>
// //               <Form.Control
// //                 type="number"
// //                 name="stock_quantity"
// //                 value={formData.stock_quantity}
// //                 onChange={handleInputChange}
// //                 required
// //               />
// //             </Form.Group>
// //             <Form.Group className="mb-3">
// //               <Form.Label>Rating</Form.Label>
// //               <Form.Control
// //                 type="number"
// //                 step="0.1"
// //                 name="rating"
// //                 value={formData.rating}
// //                 onChange={handleInputChange}
// //               />
// //             </Form.Group>
// //             <Form.Group className="mb-3">
// //               <Form.Label>Discount</Form.Label>
// //               <Form.Control
// //                 type="number"
// //                 step="0.1"
// //                 name="discount"
// //                 value={formData.discount}
// //                 onChange={handleInputChange}
// //               />
// //             </Form.Group>

// //             <h4>Product Colors</h4>
// //             {formData.product_colors.map((color, index) => (
// //               <div key={index} className="mb-3">
// //                 <div className="input-group">
// //                   <Form.Control
// //                     type="text"
// //                     placeholder="Color"
// //                     value={color.color}
// //                     onChange={(e) => handleColorChange(index, 'color', e.target.value)}
// //                   />
// //                   <Form.Control
// //                     type="file"
// //                     onChange={(e) => handleFileChange(e, index)}
// //                   />
// //                   <Button
// //                     variant="danger"
// //                     type="button"
// //                     onClick={() => removeColorField(index)}
// //                   >
// //                     Remove
// //                   </Button>
// //                 </div>
// //               </div>
// //             ))}
// //             <Button variant="secondary" onClick={addColorField}>
// //               Add Color
// //             </Button>
// //           </Col>
// //         </Row>

// //         <div className="d-flex justify-content-between mt-4">
// //           <Button variant="danger" onClick={handleDelete}>
// //             Delete Product
// //           </Button>
// //           <Button variant="success" type="submit">
// //             Save Changes
// //           </Button>
// //         </div>
// //       </Form>
// //     </Container>
// //   );
// // };



import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from './vendorNavbar';
const UpdateProductForm = () => {

  const navigate = useNavigate()
  const { id } = useParams(); // Get product ID from URL
 
  const [formData, setFormData] = useState({
    productname: '',
    productbrand: '',
    description: '',
    price: '',
   
    stock_quantity: '',
    rating: '',
    discount: '',
    product_colors: [{ color: '', image: null }], // Initial colors
  });
  const [loading, setLoading] = useState(true);

  // Fetch categories on mount
 

  // Fetch product details on mount
 // Fetch product details on mount
useEffect(() => {
  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/user/vendorproducts/${id}`);
      const productData = response.data;

      // Assuming `product_colors` is an array of objects with color and image properties
      const updatedProductColors = productData.product_colors.map((color) => ({
        color: color.color,
        image: color.image || null, // Keep existing image URLs or null if not present
      }));

      setFormData((prevState) => ({
        ...prevState,
        ...productData,
        product_colors: updatedProductColors,
      }));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };
  fetchProduct();
}, [id]);


  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle color changes
  const handleColorChange = (index, field, value) => {
    const updatedColors = [...formData.product_colors];
    updatedColors[index][field] = value;
    setFormData((prevState) => ({
      ...prevState,
      product_colors: updatedColors,
    }));
  };

  // Handle file input changes for colors
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    handleColorChange(index, 'image', file);
  };

  // Add new color field
  const addColorField = () => {
    setFormData((prevState) => ({
      ...prevState,
      product_colors: [...prevState.product_colors, { color: '', image: null }],
    }));
  };

  // Remove a color field
  const removeColorField = (index) => {
    const updatedColors = formData.product_colors.filter((_, i) => i !== index);
    setFormData((prevState) => ({
      ...prevState,
      product_colors: updatedColors,
    }));
  };

  // Update product details
  const handleUpdate = async (e) => {
    e.preventDefault();
  
    const form = new FormData();
    form.append('productname', formData.productname);
    form.append('productbrand', formData.productbrand);
    form.append('description', formData.description);
    form.append('price', formData.price);
  // Ensure this is the correct category ID
    form.append('stock_quantity', formData.stock_quantity);
    form.append('rating', formData.rating);
    form.append('discount', formData.discount);
  
    // Append product colors and their images
    formData.product_colors.forEach((color, index) => {
      form.append(`product_colors[${index}]color`, color.color);
  
      // If a new image is selected, append that image
      if (color.image instanceof File) {
        form.append(`product_colors[${index}]image`, color.image);
      } else if (color.image && typeof color.image === 'string') {
        // If image is a URL or already uploaded image, just append the existing image URL
        form.append(`product_colors[${index}]image`, color.image);
      }
    });
  
    try {
      await axios.patch(`http://localhost:8000/user/updatevendorproducts/${id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product updated successfully!');
      navigate('/vendorproduct')
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update the product.');
    }
  };
  
  // Delete product
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/user/vendorproducts/${id}`);
      alert('Product deleted successfully!');
      navigate('/vendorproduct')
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete the product.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <><div className='d-flex'>
      <Navbar/>
    <Container className="mt-5">
      <h2 className="text-center mb-4 text-success">Update Product</h2>
      <Form onSubmit={handleUpdate} encType="multipart/form-data">
        <Row className="g-4">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="productname"
                value={formData.productname}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Brand</Form.Label>
              <Form.Control
                type="text"
                name="productbrand"
                value={formData.productbrand}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
           
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
              />
            </Form.Group>

            <h4 className="mt-4">Product Colors</h4>
            {formData.product_colors.map((color, index) => (
  <div key={index} className="mb-3">
    <div className="d-flex align-items-center">
      <Form.Control
        type="text"
        placeholder="Color"
        value={color.color}
        onChange={(e) => handleColorChange(index, 'color', e.target.value)}
        className="me-2"
      />
      <Form.Control
        type="file"
        onChange={(e) => handleFileChange(e, index)}
        className="me-2"
      />
      {color.image && typeof color.image === 'string' && (
        <div>
          <img src={color.image} alt="Existing color" width="50" height="50" />
        </div>
      )}
      <Button variant="danger" type="button" onClick={() => removeColorField(index)}>
        Remove
      </Button>
    </div>
  </div>
))}
            <Button variant="secondary" onClick={addColorField}>
              Add Color
            </Button>
          </Col>
        </Row>

        <div className="d-flex justify-content-between mt-4 mb-3">
          <Button variant="danger" onClick={handleDelete}>
            Delete Product
          </Button>
          <Button variant="success" type="submit">
            Save Changes
          </Button>
        </div>
      </Form>
    </Container>
    </div>
    </>
  );
};

export default UpdateProductForm;
