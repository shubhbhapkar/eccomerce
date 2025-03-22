import Navbar from "./Navbar";

import CartCount from "./cartCount";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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

const OrderConfirmationPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const { cartCount, setCartCount, updateCartCount } = CartCount();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user/getproduct/${productId}`
        );
        setProduct(response.data);
      } catch (error) {
        alert("Failed to load product details.");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async () => {
    setLoading(true);

    if (!deliveryAddress) {
      alert("Please enter a delivery address.");
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        status: "APPROVED",
        items: [
          {
            product_id: product.id,
            quantity: quantity,
          },
        ],
        address: deliveryAddress,
        payment_method: paymentMethod,
      };
      const csrfToken = Cookies.get("csrftoken");

      const response = await axios.post(
        "http://localhost:8000/user/createorder/",
        orderData,
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      setOrderId(response.data.id); // Save the order ID
      alert(`Order placed successfully! Order ID: ${response.data.id}`);
      setShowFeedbackPopup(true); // Show feedback popup
      setQuantity(1);
      setDeliveryAddress("");
    } catch (error) {
      console.log(error);
      alert(error.response.data.detail || "Failed to place the order.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <>
  <Navbar cartCount = {cartCount}  setCartCount = {setCartCount} updateCartCount = {updateCartCount}/>
        <div className="container mt-5">
      <h1 className="text-center text-success">Order Confirmation</h1>

      {/* Product Details */}
      <div className="row mb-4">
        <div className="col-md-6">
          <img
            src={product.product_colors[0].image_url}
            alt={product.name}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>
            <strong>Price:<span className="text-success">₹{product.discounted_price * quantity}</span></strong>
          </p>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input
              type="number"
              id="quantity"
              className="form-control"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="mb-4">
        <label htmlFor="delivery-address" className="form-label">Delivery Address</label>
        <textarea
          id="delivery-address"
          className="form-control"
          rows="4"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
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

      {/* Confirm Order Button */}
      <div className="text-center mb-3">
        <button
          className="btn btn-success w-100"
          onClick={handleSubmit}
          disabled={loading || !deliveryAddress}
        >
          {loading ? "Placing Order..." : "Confirm Order"}
        </button>
      </div>

      {showFeedbackPopup && (
        <FeedbackPopup
          orderId={orderId}
          onClose={() => setShowFeedbackPopup(false)}
        />
      )}
    </div>
    </>
  );
};

export default OrderConfirmationPage;
