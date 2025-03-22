import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import Navbar from "./vendorNavbar";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // To differentiate between "status" and "shipping"
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const csrfToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrftoken="))
          ?.split("=")[1];

        const response = await axios.get("http://localhost:8000/user/vendororders/", {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        });

        setOrders(response.data.orders);
      } catch (error) {
        console.error("There was an error fetching the orders!", error);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return " text-warning";
      case "PROCESSING":
        return " text-info";
      case "SHIPPED":
        return " text-primary";
      case "DELIVERED":
        return " text-success";
      case "CANCELLED":
        return " text-danger";
      default:
        return "text-secondary";
    }
  };

  const handleUpdate = async () => {
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];

      const endpoint =
        
          `http://localhost:8000/user/orderstatus/${selectedOrderId}/`
        

      const data =
        modalType === "status"
          ? { status: selectedStatus }
          : { shipping: selectedShipping };

      await axios.patch(endpoint, data, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      });

      alert(`${modalType === "status" ? "Order status" : "Shipping method"} updated successfully!`);
      setShowModal(false); // Close the modal after successful update
    } catch (error) {
      console.error(`Error updating ${modalType}:`, error);
      alert(`Failed to update ${modalType}.`);
    }
  };

  return (
    <>
    <div className="d-flex">
      <Navbar></Navbar>
    <div className="container my-5">
      <h2 className="text-center mb-4 text-uppercase fw-bold text-success">
        Vendor's Orders
      </h2>

      {["PENDING", "APPROVED", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
        <div key={status} className="mb-5">
          <h3 className={`text-${getStatusBadge(status)} text-uppercase fw-bold mb-3`}>
            {status.charAt(0) + status.slice(1).toLowerCase()} Orders
          </h3>
          <div className="row">
            {orders
              .filter((order) => order.status === status)
              .map((order) => (
                <div className="col-md-6 col-lg-4 mb-4" key={order.id}>
                  <div className="card shadow-sm h-100">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-0">Order #{order.id}</h5>
                        <p className="m-0 text-muted">
                          Customer:{" "}
                          <span className="text-success fw-bold">{order.user}</span>
                        </p>
                        <p className="m-0 text-muted">
                          Address: <span className="fw-bold"> {order.address}</span>
                        </p>
                      </div>
                      <span className={`badge p-2`} style={{
                                             backgroundColor: order.shipping === "THIRDPARTY" ? "gray" : "green",
                                        }}>
                        {order.shipping}
                      </span>
                    </div>
                    <div className="card-body">
                      <h6>Payment Method: {order.payment_method}</h6>
                      <p>
                        <strong>Order Date:</strong>{" "}
                        {new Date(order.created_at).toLocaleString()}
                      </p>

                      <div className="d-flex flex-column">
                        {order.items.map((item, index) => (
                          <div key={index} className="d-flex align-items-center mb-3">
                            <img
                              src={`http://127.0.0.1:8000${item.product_image}`}
                              alt={item.product_name}
                              className="me-3"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                            <div>
                              <h6 className="mb-0">{item.product_name}</h6>
                              <p className="m-0">
                                Quantity: {item.quantity} x ₹{item.price}
                              </p>
                              <p className="m-0 fw-bold text-success">
                                Total: ₹{item.total_price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="card-footer  text-center">
                      {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                        <>
                          <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setModalType("status");
                              setShowModal(true);
                            }}
                          >
                            Update Status
                          </button>
                          <button
                            className="btn  btn-outline-success btn-sm"
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setModalType("shipping");
                              setShowModal(true);
                            }}
                          >
                            Update Shipping
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            {orders.filter((order) => order.status === status).length === 0 && (
              <p className="text-muted text-center">No orders found for this status.</p>
            )}
          </div>
        </div>
      ))}
      </div>

      {/* Modal for updating status or shipping */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "status" ? "Update Order Status" : "Update Shipping Method"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="select">
              <Form.Label>
                {modalType === "status" ? "Select Status" : "Select Shipping Method"}
              </Form.Label>
              <Form.Control
                as="select"
                value={modalType === "status" ? selectedStatus : selectedShipping}
                onChange={(e) =>
                  modalType === "status"
                    ? setSelectedStatus(e.target.value)
                    : setSelectedShipping(e.target.value)
                }
              >
                <option value="">
                  Select a {modalType === "status" ? "Status" : "Shipping Method"}
                </option>
                {modalType === "status" ? (
                  <>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </>
                ) : (
                  <>
                    <option value="THIRDPARTY">Third-party</option>
                    <option value="SELF-FULLFILMENT">Self-fulfillment</option>
                  </>
                )}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
};

export default VendorOrders;
