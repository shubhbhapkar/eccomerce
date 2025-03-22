import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "./Navbar";
import Footer from "./footer";
import CartCount from "./cartCount";
import { useNavigate } from "react-router-dom";
const Mycart = () => {
  const {cartCount,setCartCount,updateCartCount} = CartCount();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  const TAX_RATE = 0.1; 
  const SHIPPING_COST = 15.0; 

  const fetchProducts = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const isLoggedIn = !!user;
    const username = isLoggedIn ? user.username : '';

    

    
      try {
        const response = await fetch(`http://localhost:8000/user/cartlist/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
           credentials: 'include', // Include credentials (cookies) in the request
        });
      
        // Check if the response is successful (status 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      
        // Parse the response as JSON
        const data = await response.json();
      
        // Set the products
        setProducts(data);
      
      } catch (error) {
        console.error("Fetch error:", error);
      }
      
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("Updated products in state:", products);

    // Calculate subtotal
    const calculatedSubtotal = products.reduce((acc, item) => {
      return acc + item.product.discounted_price * item.quantity;
    }, 0);

    // Calculate tax and total with shipping
    const calculatedTax = calculatedSubtotal * (TAX_RATE / 100);
    const calculatedTotal = calculatedSubtotal + calculatedTax + SHIPPING_COST;

    setSubtotal(calculatedSubtotal);
    setTax(calculatedTax);
    setShipping(SHIPPING_COST);
    setTotal(calculatedTotal);
  }, [products]);

  const handleRemove = async (id) => {
    try {
      // Optimistically remove the item from the cart
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );

      // Perform DELETE request to remove the item from the cart
      const response = await axios.delete(`http://localhost:8000/user/deletecart/${id}/`);

      if (response.status !== 200) {
        console.error("Failed to delete item:", response);
        // If failed, add the item back to the list (rollback)
        fetchProducts(); // Refetch the cart if the deletion fails
      } else {
        console.log("Item deleted successfully:", id);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      // In case of error, restore the product list by refetching
      fetchProducts(); // Refetch the cart if an error occurs
    }
  }
  const navto=()=>{
    navigate("/checkout")
  }
  return (
    <>
    <Navbar cartCount={cartCount} setCartCount={setCartCount} updateCartCount={updateCartCount}/>
    <div className="container my-5">
  <h2 className="text-center mb-4 text-uppercase fw-bold">Your Shopping Cart</h2>

  {/* Cart Items Section */}
  <div className="row">
    {/* Products List */}
    <div className="col-lg-8">
      {products.length > 0 ? (
        <div className="list-group">
          {products.map((item, index) => (
            <div
              className="list-group-item d-flex justify-content-between align-items-center p-4 mb-3 rounded border-0 shadow-sm"
              key={index}
              style={{
                backgroundColor: "#f8f9fa", // Flipkart-style light grey background
              }}
            >
              <div className="d-flex align-items-center">
                <img
                  src={`http://127.0.0.1:8000${item.product.product_colors[0].image_url}`}
                  alt={item.product.name}
                  className="img-thumbnail me-3 border-0"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px", // Rounded image
                  }}
                />
                <div>
                  <h5 className="mb-1 fw-bold text-dark">{item.product.productname}</h5>
                  <p className="mb-1 text-muted">
                    Price: <span className="fw-bold" style={{color:"#2ECC71"}}>${item.product.discounted_price}</span>
                  </p>
                  <p className="mb-0 text-muted">
                    Quantity: <span className="text-dark">{item.quantity}</span>
                  </p>
                </div>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  handleRemove(item.id);
                  updateCartCount(-1);
                }}
              >
                <i className="bi bi-trash"></i> Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info mt-3 text-center">Your cart is empty.</div>
      )}
    </div>

    {/* Order Summary Section */}
    <div className="col-lg-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="card-title text-center fw-bold text-uppercase">Order Summary</h5>
          <hr />
          <p className="d-flex justify-content-between">
            <span className="text-muted">Subtotal:</span>
            <span className="fw-bold">${subtotal.toFixed(2)}</span>
          </p>
          <p className="d-flex justify-content-between">
            <span className="text-muted">Tax (10%):</span>
            <span className="fw-bold">${tax.toFixed(2)}</span>
          </p>
          <p className="d-flex justify-content-between">
            <span className="text-muted">Shipping:</span>
            <span className="fw-bold">${shipping.toFixed(2)}</span>
          </p>
          <hr />
          <p className="d-flex justify-content-between fs-5">
            <span className="fw-bold text-dark">Total:</span>
            <span className="fw-bold text-success">${total.toFixed(2)}</span>
          </p>
           <button className="btn text-uppercase w-100 mt-3" style={{
                transition: "background-color 0.2s ease",
                background: "#2ECC71", // Corrected color code
              }}
                onClick={navto}
              >
                Proceed to Checkout
            </button>

        </div>
      </div>
    </div>
  </div>
</div>

    <Footer/>
    </>
  );
};

export default Mycart;
