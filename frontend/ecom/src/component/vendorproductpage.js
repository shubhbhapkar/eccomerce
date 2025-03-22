// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Spinner } from 'react-bootstrap';
// import { NavLink } from 'react-router-dom';


// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Replace with your actual API endpoint
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/user/vendorproducts/', {
//           withCredentials: true,  // Ensures credentials (like session cookies) are sent
//         });
//         setProducts(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//         <Spinner animation="border" />
//       </div>
//     );
//   }

//   return (
//     <div className="container my-5">
//     <h2 className="text-center mb-4 text-uppercase fw-bold">Your Products</h2>

//     <div className="container mt-5 position-sticky top-0">
//       <div className="d-flex justify-content-center justify-content-md-end ">
//         <button 
//           className="btn btn-outline-success btn-lg shadow-sm border-0 px-4 py-2 rounded-3 ms-xl-3 mt-5" 
//           style={{ zIndex: 9999 }}
//         >
//           <NavLink to="/addpro" className="text-decoration-none text-success">
//             <strong>ADD PRODUCT</strong>
//           </NavLink>
//         </button>
//       </div>
//     </div>



//     {/* Cart Items Section */}
//     <div className="row">
//       {/* Products List */}
//       <div className="col-lg-9">
//         {products.length > 0 ? (
//           <div className="list-group">
//             {products.map((item, index) => (
//               <div
//                 className="list-group-item d-flex justify-content-between align-items-center p-4 mb-3 rounded border-0 shadow-sm"
//                 key={index}
//                 style={{
//                   backgroundColor: "#f8f9fa", // Flipkart-style light grey background
//                 }}
//               >
//                 <div className="d-flex align-items-center">
//                   <img
//                     src={`http://127.0.0.1:8000${item.product_colors[0].image_url}`}
//                     alt={item.name}
//                     className="img-thumbnail me-3 border-0"
//                     style={{
//                       width: "100px",
//                       height: "100px",
//                       objectFit: "cover",
//                       borderRadius: "8px", // Rounded image
//                     }}
//                   />
//                   <NavLink to={`/vendorproduct/${item.id}`}>
//                   <div>
//                     <h5 className="mb-1 fw-bold text-dark">{item.productname}</h5>
//                     <p className="mb-1 text-muted">
//                       Price: <span className="fw-bold" style={{color:"#2ECC71"}}>${item.discounted_price}</span>
//                     </p>
//                     <p className="mb-0 text-muted">
//                       Quantity: <span  style={{color:"#2ECC71"}}>{item.stock_quantity}</span>
//                     </p>
//                     <p className="mb-0 text-muted">
//                       Discount: <span style={{color:"#2ECC71"}}>{item.discount}%</span>
//                     </p>
//                   </div>
//                   </NavLink>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="alert alert-info mt-3 text-center">Your cart is empty.</div>
//         )}
//       </div>
  
 
//     </div>
//   </div>
//   );
// };

// export default ProductList;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Card, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Navbar from './vendorNavbar';
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual API endpoint
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/user/vendorproducts/', {
          withCredentials: true,  // Ensures credentials (like session cookies) are sent
        });
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
    <div className='d-flex'>
    <Navbar/>
    <div className="container my-5">
      <h2 className="text-center mb-4 text-uppercase fw-bold">Your Products</h2>

      <div className="container mt-5 position-sticky top-0">
        <div className="d-flex justify-content-center justify-content-md-end ">
          <button
            className="btn btn-outline-success btn-lg shadow-sm border-0 px-4 py-2 rounded-3 ms-xl-3 mt-z"
            style={{ zIndex: 9999 }}
          >
            <NavLink to="/addpro" className="text-decoration-none text-success">
              <strong>ADD PRODUCT</strong>
            </NavLink>
          </button>
        </div>
      </div>

      {/* Product Cards Section */}
      <div className="row">
        {/* Products List */}
        {products.length > 0 ? (
          products.map((item, index) => (
            <div key={index} className="col-lg-4 col-md-6 mb-4">
              <Card style={{ width: '100%', backgroundColor: "#f8f9fa" }} className="shadow-sm">
                <Card.Img
                  variant="top"
                  src={`http://127.0.0.1:8000${item.product_colors[0].image_url}`}
                  alt={item.productname}
                  style={{ height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <Card.Body>
                  <Card.Title className="fw-bold text-dark">{item.productname}</Card.Title>
                  <Card.Text>
                    <p className="mb-1 text-muted">
                      Price: <span className="fw-bold" style={{ color: "#2ECC71" }}>${item.discounted_price}</span>
                    </p>
                    <p className="mb-1 text-muted">
                      Quantity: <span style={{ color: "#2ECC71" }}>{item.stock_quantity}</span>
                    </p>
                    <p className="mb-1 text-muted">
                      Discount: <span style={{ color: "#2ECC71" }}>{item.discount}%</span>
                    </p>
                  </Card.Text>
                  <NavLink to={`/vendorproduct/${item.id}`} className="btn btn-success w-100">
                    Update
                  </NavLink>
                  
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <div className="alert alert-info mt-3 text-center">Your products list is empty.</div>
        )}
      </div>
    </div>
    </div>
    </>
  );
};

export default ProductList;
