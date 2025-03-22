

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { NavLink } from 'react-router-dom';
import Search from './search';

const Navbar = ({cartCount,setCartCount,updateCartCount}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [categor, setCategor] = useState([]);
  console.log(cartCount,"cart count in the navbar")
  
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (user) {
      setIsLoggedIn(true);
      setUsername(user.username);
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }

    // Fetch categories
    fetch('http://localhost:8000/user/viewcat/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include credentials (cookies) in the request
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCategor(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
    
  }, []);
  
  
  const handleLogout = async () => {
    try {
      // Make a POST request to log out
      const csrfToken = document.cookie
  .split('; ')
  .find(row => row.startsWith('csrftoken='))
  ?.split('=')[1];

const response = await fetch('http://localhost:8000/user/logout/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
  },
  credentials: 'include',
});
  
      // Check if the response is successful (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the response as JSON
      const data = await response.json();
  
      if (data.message === 'Logout successful') {
        // Clear session storage and reset states
        sessionStorage.clear();
        setIsLoggedIn(false);
        setUsername('');
        setCartCount(0);
        console.log('Logged out successfully');
      } else {
        console.error('Error logging out:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  return (
    <>
      <nav
  className="navbar navbar-expand-lg navbar-light bg-light position-sticky top-0 shadow-sm"
  style={{ height: "65px", zIndex: 1050 }}
>
  <div className="container">
    {/* Brand Logo */}
    <NavLink className="navbar-brand d-flex align-items-left" to="/">
      <img
        src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg"
        height="40"
        alt="Brand Logo"
        className="me-2"
      />
     
    </NavLink>

    {/* Toggle Button for Mobile */}
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    {/* Navbar Links */}
    <div className="collapse navbar-collapse bg-light" id="navbarNav" >
      <ul className="navbar-nav ms-auto">
        <li className="nav-item fs-5 ms-1">
          <NavLink className="nav-link fw-bold" to="/" style={{color:"#28A65D"}}>
            Home
          </NavLink>
        </li>

       
        <li className="nav-item fs-5 ms-1 fw-bold" style={{color:"#28A65D"}}>
          <NavLink className="nav-link fw-bold" style={{color:"#28A65D"}} to="/about">
            About
          </NavLink>
        </li>

        <li className="nav-item fs-5 ms-1 fw-bold" style={{color:"#28A65D"}}>
          <NavLink className="nav-link fw-bold" style={{color:"#28A65D"}} to="/userorders">
            My Orders
          </NavLink>
        </li>

        {/* Products Dropdown */}
        <li className="nav-item dropdown fs-5 fw-bold" style={{color:"#28A65D"}}>
          <NavLink
            className="nav-link dropdown-toggle fw-bold" style={{color:"#28A65D"}}
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Products
          </NavLink>
          <ul
            className="dropdown-menu dropdown-menu-end shadow-lg"
            aria-labelledby="navbarDropdown"
          >
            {categor && categor.length > 0 ? (
              categor.map((category) => (
                <li key={category.id}>
                  <NavLink
                    to={`/products/${category.name}`}
                    className="dropdown-item d-flex justify-content-between"
                  >
                    {category.name}
                    <span className="badge bg-primary rounded-pill">
                      {category.productCount}
                    </span>
                  </NavLink>
                </li>
              ))
            ) : (
              <li>
                <span className="dropdown-item text-muted">
                  No Categories Available
                </span>
              </li>
            )}
          </ul>
        </li>

        {/* Cart Icon with Cart Count */}
        <li className="nav-item ms-2 fw-bold" style={{color:"#28A65D"}}>
          <NavLink
            className="nav-link position-relative  fs-5 fw-bold" style={{color:"#28A65D"}}
            to={isLoggedIn ? "/MYcart" : "#"}
            onClick={(e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                alert("You need to log in to access the cart.");
              }
            }}
          >
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
            {cartCount > 0 && (
              <span className="position-absolute top--1 start-90 translate-middle badge rounded-pill bg-danger text-dark">
                {cartCount}
              </span>
            )}
          </NavLink>
        </li>

        {/* User Section */}
        <li className="nav-item ms-xl-3">
          {isLoggedIn ? (
            <div className="d-inline-flex align-items-center">
              <NavLink className="nav-link text-primary fw-bold" to="/user">
                <span className="d-inline-flex align-items-center fs-5 ">
                  {username} <FontAwesomeIcon icon={faCircleUser} className="ms-1" />
                </span>
              </NavLink>
              <button
                className="btn btn-outline-danger ms-3 fs-6"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink className="nav-link fs-5 fw-bold" style={{color:"#28A65D"}} to="/login">
              <span className="d-inline-flex align-items-center">
                Login <FontAwesomeIcon icon={faCircleUser} className="ms-1" />
              </span>
            </NavLink>
          )}
        </li>
      </ul>
    </div>
  </div>
</nav>
          <Search updateCartCount={updateCartCount} />
      
    </>
  );
};

export default Navbar;
