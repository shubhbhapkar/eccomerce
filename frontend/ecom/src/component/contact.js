import React, { useState,useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot,faPhone,faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from "react-router-dom";
import Navbar from './Navbar';
import CartCount from './cartCount'; 

const Contact = () => {

  const location = useLocation();
  const { cartCount, setCartCount, updateCartCount } = CartCount();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when the route changes
  }, [location]);

    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        message: ""
    });
    const [statusMessage, setStatusMessage] = useState("");

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setStatusMessage("");
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await fetch("http://localhost:8000/user/contact/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setStatusMessage("Message sent successfully!");
                setFormData({ name: "", subject: "", message: "" }); // Reset the form
            } else {
                const errorData = await response.json();
                setStatusMessage(`Failed to send message: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            setStatusMessage("An error occurred while sending the message.");
            console.error(error);
        }
    };

    return (
        <>
        <Navbar cartCount={cartCount} setCartCount={setCartCount} updateCartCount={updateCartCount}/>
          <div className="container-fluid py-5" style={{ backgroundColor: "#f1f3f6" }}>
  <div className="text-center mb-5">
    <h1 className="text-success fw-bold">Contact Us</h1>
    <p className="lead text-muted mt-2">
      Have questions? We're here to help! Reach out to us using the form below.
    </p>
  </div>

  <div className="row justify-content-center">
    {/* Contact Info Section */}
    <div className="col-12 col-md-4 mb-4">
      <div
        className="p-4 shadow-sm rounded bg-white"
        style={{ border: "1px solid #e3e3e3" }}
      >
        <div className="mb-4">
          <h4
            title="Open Location"
            className="text-success"
            onClick={() =>
              window.open(
                "https://www.google.com/maps?q=Pandit+Colony,+Nashik+414101",
                "_blank"
              )
            }
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faLocationDot} className="me-2" />
            Address
          </h4>
          <p className="text-muted mb-0">
            Eaglbypte Pvt Ltd, Pandit Colony, <br />
            Nashik 414101
          </p>
        </div>
        <div className="mb-4">
          <h4 className="text-success">
            <FontAwesomeIcon icon={faPhone} className="me-2" />
            Phone
          </h4>
          <p className="text-muted mb-0">+91 9359477699</p>
        </div>
        <div>
          <h4 className="text-success">
            <FontAwesomeIcon icon={faEnvelope} className="me-2" />
            Email
          </h4>
          <p className="text-muted">shubhambhapkar0@gmail.com</p>
        </div>
      </div>
    </div>

    {/* Contact Form Section */}
    <div className="col-12 col-md-6">
      <div
        className="p-4 shadow-sm rounded bg-white"
        style={{ border: "1px solid #e3e3e3" }}
      >
        <form onSubmit={handleSubmit}>
          <h3 className="text-success mb-4 text-center">Get in Touch</h3>
          <input
            className="form-control mb-3"
            placeholder="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ borderColor: "#ced4da" }}
          />
          <input
            className="form-control mb-3"
            placeholder="Your Subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            style={{ borderColor: "#ced4da" }}
          />
          <textarea
            className="form-control mb-3"
            placeholder="Your Message"
            rows="5"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            style={{ borderColor: "#ced4da" }}
          />
          <button
            className="btn btn-success w-100 py-2 text-uppercase fw-bold"
            type="submit"
          >
            Send Message
          </button>
        </form>
        {statusMessage && (
          <div className="mt-3 text-center">
            <p className="text-danger">{statusMessage}</p>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Embedded Google Maps */}
  <div className="text-center mt-5">
    <iframe
      title="Location"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.7964807682683!2d73.7734876!3d20.0020625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb8b9c3d14a9%3A0xad6f158a306dd206!2sManasvi%20Tech%20Solutions!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
      width="100%"
      height="400"
      style={{ border: 0 }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</div>

        </>
    );
};

export default Contact;
