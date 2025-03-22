// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const UserOrders = () => {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         // Fetch the CSRF token from the cookie
//         const csrfToken = document.cookie
//           .split("; ")
//           .find((row) => row.startsWith("csrftoken="))
//           ?.split("=")[1];

//         // Make the request to fetch orders
//         const response = await axios.get("http://localhost:8000/user/orderss/", {
//           headers: {
//             "Content-Type": "application/json",
//             "X-CSRFToken": csrfToken, // Include CSRF token
//           },
//           withCredentials: true, // Send cookies with the request
//         });

//         setOrders(response.data.orders);
//       } catch (error) {
//         console.error("There was an error fetching the orders!", error);
//       }
//     };

//     fetchOrders();
//   }, []);

//   // Custom function to return badge styles
//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "PENDING":
//         return { backgroundColor: "#ffc107", color: "#212529" }; // Yellow background
//       case "PROCESSING":
//         return { backgroundColor: "#17a2b8", color: "#fff" }; // Light blue
//       case "SHIPPED":
//         return { backgroundColor: "#007bff", color: "#fff" }; // Blue
//       case "DELIVERED":
//         return { backgroundColor: "#28a745", color: "#fff" }; // Green
//       case "CANCELLED":
//         return { backgroundColor: "#dc3545", color: "#fff" }; // Red
//       default:
//         return { backgroundColor: "#6c757d", color: "#fff" }; // Grey
//     }
//   };

//   return (
//     <div className="container my-5">
//       <h2 className="text-center mb-4 text-uppercase fw-bold text-primary">
//         Your Orders
//       </h2>

//       {orders.map((order) => (
//         <div className="card mb-4 shadow-sm" key={order.id}>
//           <div className="card-header d-flex justify-content-between align-items-center">
//             <div>
//               <h5>Order #{order.id}</h5>
//               <p className="m-0 text-muted">Address: {order.address}</p>
//             </div>
//             <span
//               className="badge p-2 rounded-pill"
//               style={getStatusBadge(order.status)} // Inline style applied here
//             >
//               {order.status}
//             </span>
//           </div>

//           <div className="card-body">
//             <h6>Payment Method: {order.payment_method}</h6>
//             <p>Order Created At: {new Date(order.created_at).toLocaleString()}</p>

//             <div className="row">
//               {order.items.map((item, index) => (
//                 <div className="col-md-4" key={index}>
//                   <div className="card shadow-sm mb-3">
//                     <div className="card-body">
//                       <div className="d-flex align-items-center">
//                         <img
//                           src={`http://127.0.0.1:8000${item.product_image}`}
//                           alt={item.product_name}
//                           className="me-3 rounded"
//                           style={{
//                             width: "100px",
//                             height: "100px",
//                             objectFit: "cover",
//                           }}
//                         />
//                         <div>
//                           <h5>{item.product_name}</h5>
//                           <p className="m-0">Quantity: {item.quantity} x ${item.price}</p>
//                           <p className="m-0 fw-bold text-success">
//                             Total: ${item.total_price}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default UserOrders;


import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import CartCount from "./cartCount";
import { useLocation } from 'react-router-dom';
import Navbar from "./Navbar";
const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when the route changes
  }, [location]);

    const { cartCount, setCartCount, updateCartCount } = CartCount();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch the CSRF token from the cookie
        const csrfToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrftoken="))
          ?.split("=")[1];

        // Make the request to fetch orders
        const response = await axios.get("http://localhost:8000/user/orderss/", {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken, // Include CSRF token
          },
          withCredentials: true, // Send cookies with the request
        });

        setOrders(response.data.orders);
      } catch (error) {
        console.error("There was an error fetching the orders!", error);
      }
    };

    fetchOrders();
  }, []);

  // Custom function to return badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return { backgroundColor: "#ffc107", color: "#212529" }; // Yellow background
      case "PROCESSING":
        return { backgroundColor: "aqua", color: "#fff" }; // Light blue
      case "SHIPPED":
        return { backgroundColor: "#007bff", color: "#fff" }; // Blue
      case "DELIVERED":
        return { backgroundColor: "#28a745", color: "#fff" }; // Green
      case "CANCELLED":
        return { backgroundColor: "#dc3545", color: "#fff" }; // Red
      case "APPROVED":
          return { backgroundColor: "#17a2b8", color: "#fff" }; // Red
      default:
        return { backgroundColor: "#6c757d", color: "#fff" }; // Grey
    }
  };

  // Function to handle order cancellation
  const handleCancelOrder = async () => {
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];

      const response = await axios.patch(
        `http://localhost:8000/user/orderstatus/${selectedOrderId}/`,
        { status: "CANCELLED" },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );
      alert("Your order has been cancelled.");
      setShowModal(false); // Close the modal after cancellation
      // Fetch the orders again to reflect the updated status
      // fetchOrders();
      console.log(response.data)
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel the order.");
    }
  };

  return (
    <>
     <Navbar cartCount = {cartCount}  setCartCount = {setCartCount} updateCartCount = {updateCartCount}/>
    <div className="container my-5">
      <h2 className="text-center mb-4 text-uppercase fw-bold text-success">
        Your Orders
      </h2>

      {orders.map((order) => (
        <div className="card mb-4 shadow-sm" key={order.id}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <h5>Order  <span className="text-success">#{order.id}</span></h5>
              <p className="m-0 text-dark fw-bold">Address:  <span className="text-success">{order.address}</span></p>
            </div>
          
            <span
              className="badge  p-2 rounded-pill m-2 fw-bold fs-6"
                style={{
                  color:order.shipping === "THIRDPARTY" ? "brown" : "green",
                }}
            >
              {order.shipping}
            </span>
            <span
              className="badge p-2 rounded-pill"
              style={getStatusBadge(order.status)} // Inline style applied here
            >
              {order.status}
            </span>
           
          </div>

          <div className="card-body">
            <h6 className="text-dark fw-bold">Payment Method:  <span className="text-success">{order.payment_method}</span></h6>
            <p className="text-dark fw-bold">Order Created At: <span className="text-success"> {new Date(order.created_at).toLocaleString()}</span></p>

            <div className="row">
              {order.items.map((item, index) => (
                <div className="col-md-4" key={index}>
                  <div className="card shadow-sm mb-3">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <img
                          src={`http://127.0.0.1:8000${item.product_image}`}
                          alt={item.product_name}
                          className="me-3 rounded"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <h5>{item.product_name}</h5>
                          <p className="m-0 text-dark fw-bold">Quantity: <span className="text-success">{item.quantity}</span> x <span className="text-success">${item.price}</span></p>
                          <p className="m-0 fw-bold text-dark">
                            Total: $ <span className="text-success">{item.total_price}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cancel Order Button */}
            {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
              <button
                className="btn btn-sm btn-outline-danger mt-3"
                onClick={() => {
                  setSelectedOrderId(order.id); // Set the selected order ID
                  setShowModal(true); // Show the confirmation modal
                }}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Modal for cancellation confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel this order?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={handleCancelOrder}>
            Yes, Cancel Order
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
};

export default UserOrders;
