import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faShoppingCart,
  faCommentDots,
  faBoxOpen,
  faSignOutAlt,
  faBars
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate, NavLink } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  console.log(isLoggedIn)
  // Fetch the summary data from the API
 
  useEffect(()=>{
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setUsername(user.username);
    
    }
 },[])
  const handleLogout = async () => {
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];

      const response = await fetch("http://localhost:8000/user/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.message === "Logout successful") {
        sessionStorage.clear();
        setIsLoggedIn(false);
        setUsername("");
        navigate("/login");
      } else {
        console.error("Error logging out:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
 
  const [isCollapsed, setIsCollapsed] = useState(false); // State to toggle the sidebar visibility

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed); // Toggle sidebar visibility
  };

  return (
    <div className="d-flex">
      {/* Sidebar - Always visible on large screens, collapsible on small screens */}
      <div
        className={`sidebar bg-light shadow-lg position-fixed ${isCollapsed ? 'collapse' : ''}`}
        style={{
          width: isCollapsed ? '20px' : '250px', // Sidebar width when collapsed
          height: '100vh',
          top: 0,
          left: 0,
          zIndex: 1050,
          backgroundColor: '#f4f4f4',
          transition: 'width 0.3s ease',
        }}
      >
        {/* Navbar logo */}
        <NavLink className="navbar-brand text-center" to="/dashboard" style={{ marginTop: '30px' }}>
          <img
            src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg"
            height="40"
            alt="Brand Logo"
            className="mt-5"
          />
        </NavLink>

        {/* Navigation items */}
        <ul className="nav flex-column mt-4">
          <li className="nav-item">
            <NavLink className="nav-link fs-5 text-success d-flex align-items-center" to="/vendorproduct">
              <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
              <span className={`${isCollapsed ? 'd-none' : ''}`}>Products</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link fs-5 text-success d-flex align-items-center" to="/vendororders">
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              <span className={`${isCollapsed ? 'd-none' : ''}`}>Orders</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link fs-5 text-success d-flex align-items-center" to="/feedback">
              <FontAwesomeIcon icon={faCommentDots} className="me-2" />
              <span className={`${isCollapsed ? 'd-none' : ''}`}>Feedbacks</span>
            </NavLink>
          </li>
          <li className="nav-item mt-2 mb-3">
            <div className="d-flex align-items-center">
              <NavLink className="nav-link fs-5 text-success d-flex align-items-center" to="/vendorprofile">
                <FontAwesomeIcon icon={faCircleUser} className="me-2 fs-5" />
                <span className={`${isCollapsed ? 'd-none' : ''}`}>{username}</span>
              </NavLink>
            </div>
          </li>

          {/* Logout Button */}
          <li className="nav-item ms-3">
            <button className="btn btn-outline-danger ms-auto fs-6" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
              <span className={`${isCollapsed ? 'd-none' : ''}`}>Logout</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Toggle button - Always visible on small screens */}
      <button
        className="btn btn-link  text-success position-fixed"
        style={{ top: '20px', left: '20px', zIndex: 1060 }}
        onClick={toggleSidebar}
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>

      {/* Main Content */}
      <div
        className="content flex-grow-1"
        style={{
          marginLeft: isCollapsed ? '20px' : '250px', // Adjust for collapsed sidebar
          padding: '20px',
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* Main content goes here */}
      </div>
    </div>
  );
};
export default Navbar;
