import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "./Navbar";
import Footer from "./footer";
import CartCount from "./cartCount";
import { useNavigate } from "react-router-dom";


import Cookies from "js-cookie";
const FeedbackPopup = ({ orderId, onClose }) => {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmitFeedback = async () => {
    if (!feedback) {
      setMessage("Please provide feedback before submitting.");
      return;
    }

    setLoading(true);
    try {
      const csrfToken = Cookies.get("csrftoken");
      await axios.post(
        "http://localhost:8000/user/feedback/",
        {
          order: orderId,
          feedback: feedback,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );
      alert("Feedback submitted successfully!");
      onClose(); // Close the popup
      navigate("/userorders"); // Redirect to My Orders
    } catch (error) {
      console.error(error);
      setMessage("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
     
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75">
      <div className="bg-white rounded p-4 shadow-lg" style={{ maxWidth: "500px", width: "90%" }}>
        <h5 className="text-center text-success">We Value Your Feedback</h5>
        <textarea
          className="form-control mt-3"
          rows="4"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your feedback here..."
        ></textarea>
        {message && (
          <div className="mt-2 text-danger small">{message}</div>
        )}
        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-success"
            onClick={handleSubmitFeedback}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};



const OrderConfirm = () => {
  const { cartCount, setCartCount, updateCartCount } = CartCount();

  const [products, setProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [orderId,setOrderId] = useState(null)

  const TAX_RATE = 10; // Tax rate in percentage
  const SHIPPING_COST = 15.0; // Fixed shipping cost

  const fetchProducts = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const username = user?.username || "";

    try {
      const response = await fetch(`http://localhost:8000/user/cartlist/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const calculatedSubtotal = products.reduce(
      (acc, item) => acc + item.product.discounted_price * item.quantity,
      0
    );
    const calculatedTax = (calculatedSubtotal * TAX_RATE) / 100;
    const calculatedTotal = calculatedSubtotal + calculatedTax + SHIPPING_COST;

    setSubtotal(calculatedSubtotal);
    setTax(calculatedTax);
    setShipping(SHIPPING_COST);
    setTotal(calculatedTotal);
  }, [products]);

  const handleOrderSubmit = async () => {
    if (!address.trim()) {
      alert("Please provide a delivery address.");
      return;
    }
  
   
  
    // Retrieve CSRF token from cookies
    const getCSRFToken = () => {
      const cookies = document.cookie.split("; ");
      const csrfCookie = cookies.find((cookie) => cookie.startsWith("csrftoken="));
      return csrfCookie ? csrfCookie.split("=")[1] : null;
    };
  
    const csrfToken = getCSRFToken();
  
    if (!csrfToken) {
      alert("CSRF token not found. Please refresh the page.");
      return;
    }
  
    const orderData = {
      address,
      payment_method: "COD",
      
    };
  
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8000/user/checkout/",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken, // Include CSRF token in headers
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 201) {
        setOrderId(response.data.order_id);
        alert(`Order placed successfully! Order ID: ${response.data.order_id}`);
        setProducts([]);
        setAddress("");
        updateCartCount(0);
        setShowFeedbackPopup(true);
      } else {
        console.error("Order placement failed:", response.data);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Navbar cartCount={cartCount} setCartCount={setCartCount} updateCartCount={updateCartCount} />

      <div className="container my-5">
        <h2 className="text-center mb-4 text-uppercase fw-bold text-primary">Order Confirmation</h2>

        <div className="row">
          {/* Cart Products */}
          <div className="col-lg-8">
            <div className="bg-white p-3 rounded shadow-sm">
              <h4 className="fw-bold mb-3">Your Cart</h4>
              {products.length > 0 ? (
                products.map((item, index) => (
                  <div
                    className="d-flex justify-content-between align-items-center p-3 mb-3 border-bottom"
                    key={index}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={`http://127.0.0.1:8000${item.product.product_colors[0].image_url}`}
                        alt={item.product.productname}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        className="me-3 shadow-sm"
                      />
                      <div>
                        <h5 className="m-0 fw-bold text-dark">{item.product.productname}</h5>
                        <small className="text-muted">Quantity: {item.quantity}</small>
                        <p className="text-success fw-bold m-0">
                          ${item.product.discounted_price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">Your cart is empty.</p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="fw-bold mb-4">Order Summary</h4>
              <p className="d-flex justify-content-between">
                Subtotal: <span>${subtotal.toFixed(2)}</span>
              </p>
              <p className="d-flex justify-content-between">
                Tax (10%): <span>${tax.toFixed(2)}</span>
              </p>
              <p className="d-flex justify-content-between">
                Shipping: <span>${shipping.toFixed(2)}</span>
              </p>
              <hr />
              <h5 className="d-flex justify-content-between">
                Total: <span>${total.toFixed(2)}</span>
              </h5>

              {/* Delivery Address */}
              <div className="mb-4">
                <label htmlFor="delivery-address" className="form-label">Delivery Address</label>
                <textarea
                  id="delivery-address"
                  className="form-control"
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                ></textarea>
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <label htmlFor="payment-method" className="form-label">Payment Method</label>
                <div className="form-check">
                  <input
                    type="radio"
                    id="cod"
                    name="payment-method"
                    value="COD"
                    className="form-check-input"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="cod">
                    Cash on Delivery (COD)
                  </label>
                </div>
              </div>

              <button
                className="btn btn-success w-100"
                onClick={handleOrderSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
            {showFeedbackPopup && (
            <FeedbackPopup
            orderId={orderId}
            onClose={() => setShowFeedbackPopup(false)}
             />
      )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderConfirm;
