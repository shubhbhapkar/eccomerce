import React from "react";
import { Link, NavLink } from "react-router-dom";
import './footer.css';
const Footer = () =>{
    return(
        <>
   

   <div className="text-white bg-dark">
  <div className="container py-5">
    {/* Contact Information Row */}
    <div className="row mb-4 text-center text-md-start">
      <div className="col-12 col-md-4 mb-3 mb-md-0 d-flex align-items-center">
        <img 
          src={`${process.env.PUBLIC_URL}/images/linkedin-icon.png`} 
          alt="LinkedIn" 
          className="me-2" 
          width="20" 
        />
        <NavLink to="/about" className="text-white text-decoration-none fw-bold">Loram Ipsum Hosting Web</NavLink>
      </div>
      <div className="col-12 col-md-4 mb-3 mb-md-0 d-flex align-items-center">
        <img 
          src={`${process.env.PUBLIC_URL}/images/call-icon.png`} 
          alt="Phone" 
          className="me-2" 
          width="20" 
        />
        <a href="tel:+7586656566" className="text-white text-decoration-none fw-bold">Call: +7586656566</a>
      </div>
      <div className="col-12 col-md-4 d-flex align-items-center">
        <img 
          src={`${process.env.PUBLIC_URL}/images/mail-icon.png`} 
          alt="Email" 
          className="me-2" 
          width="20" 
        />
        <a href="mailto:demo@gmail.com" className="text-white text-decoration-none fw-bold">demo@gmail.com</a>
      </div>
    </div>

    {/* Footer Links Section */}
    <div className="row text-center text-md-start">
      {/* Useful Links */}
      <div className="col-lg-4 col-md-6 mb-4">
        <h5 className="text-uppercase mb-3 fw-bold">Useful Links</h5>
        <ul className="list-unstyled">
          <li><Link to="/" className="text-white text-decoration-none">Home</Link></li>
          <li><Link to="/about" className="text-white text-decoration-none">About</Link></li>
          <li><Link to="/service" className="text-white text-decoration-none">Service</Link></li>
          <li><Link to="/contact" className="text-white text-decoration-none">Contact Us</Link></li>
        </ul>
      </div>

      {/* Our Products */}
      <div className="col-lg-4 col-md-6 mb-4">
        <h5 className="text-uppercase mb-3 fw-bold">Our Products</h5>
        <p className="text-white-50">Many companies work under us. Check out our range of offerings.</p>
      </div>

      {/* Connect With Us */}
      <div className="col-lg-4 col-md-6 mb-4">
        <h5 className="text-uppercase mb-3 fw-bold">Connect With Us</h5>
        <div className="d-flex justify-content-center justify-content-md-start">
          <a href="https://twitter.com" className="me-3">
            <img src={`${process.env.PUBLIC_URL}/images/twitter-icon.png`} alt="Twitter" width="20" />
          </a>
          <a href="https://linkedin.com" className="me-3">
            <img src={`${process.env.PUBLIC_URL}/images/linkedin-icon.png`} alt="LinkedIn" width="20" />
          </a>
          <a href="mailto:demo@gmail.com" className="me-3">
            <img src={`${process.env.PUBLIC_URL}/images/mail-icon.png`} alt="Email" width="20" />
          </a>
          <a href="https://youtube.com" className="me-3">
            <img src={`${process.env.PUBLIC_URL}/images/youtub-icon.png`} alt="YouTube" width="20" />
          </a>
        </div>
      </div>
    </div>

    {/* Footer Bottom */}
    <div className="text-center py-3 mt-4 border-top border-secondary">
      <p className="mb-0 text-white-50">&copy; 2024 YourBrand. Shubham Bhapkar. All rights reserved.</p>
    </div>
  </div>
</div>

  </>
    )
}

export default Footer;