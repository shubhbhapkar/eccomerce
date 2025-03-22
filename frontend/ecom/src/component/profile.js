import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import CartCount from "./cartCount";

const Profile = () => {

  const { cartCount, setCartCount, updateCartCount } = CartCount();

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when the route changes
  }, [location]);

    const [user, setUser] = useState({
        id: "",
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
    });

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // Track edit mode
    const [message,setMessage] = useState("")

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get("http://localhost:8000/user/profile/", {
                    withCredentials: true,
                });
    
                // Check and log the response to verify the data structure
                console.log("Full Response:", response);
    
                const userData = Array.isArray(response.data) ? response.data[0] : response.data;
                if (userData) {
                    setUser({
                        id: userData.id || "",
                        username: userData.username || "",
                        first_name: userData.first_name || "",
                        last_name: userData.last_name || "",
                        email: userData.email || "",
                        phone_number: userData.phone_number || "",
                        address: userData.address || "",
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setLoading(false);
            }
        };
    
        fetchUserProfile();
    }, []); 

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [id]: value

        }));
        setMessage("");
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };



    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    const csrfToken = getCookie("csrftoken");



    const handleSaveClick = async () => {
        try {
            axios.patch("http://localhost:8000/user/profileUpdate/", user, {
                headers: {
                    "X-CSRFToken": csrfToken, // Include the CSRF token in the header
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            setMessage("your profile updated successfully")
           
            
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
      <>
      <Navbar cartCount={cartCount} setCartCount={setCartCount} updateCartCount={updateCartCount}/>
        <div className="container mt-5" style={{transform:"none",transition:"none"}}>
  <div className="row justify-content-center" style={{transform:"none",transition:"none"}}>
    <div className="col-md-8" style={{transform:"none",transition:"none"}}>
      <div className="card shadow-sm rounded border-0" style={{transform:"none",transition:"none"}}>
        {/* Header */}
        <div
          className="card-header text-center text-white fw-bold bg-success"
          style={{
             // Flipkart's blue color
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
        >
          <h4>My Profile</h4>
        </div>

        {/* Body */}
        <div className="card-body" style={{ backgroundColor: "#f5f5f5" }}>
          <span className="text-success d-block mb-3">{message}</span>
          <form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-semibold">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={user.username}
                onChange={handleInputChange}
                readOnly={!isEditing}
                style={{
                  backgroundColor: isEditing ? "white" : "#e9ecef", // Read-only fields are slightly greyed out
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="first_name" className="form-label fw-semibold">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                className="form-control"
                value={user.first_name}
                onChange={handleInputChange}
                readOnly={!isEditing}
                style={{
                  backgroundColor: isEditing ? "white" : "#e9ecef",
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="last_name" className="form-label fw-semibold">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                className="form-control"
                value={user.last_name}
                onChange={handleInputChange}
                readOnly={!isEditing}
                style={{
                  backgroundColor: isEditing ? "white" : "#e9ecef",
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={user.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
                style={{
                  backgroundColor: isEditing ? "white" : "#e9ecef",
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone_number" className="form-label fw-semibold">
                Phone Number
              </label>
              <input
                type="text"
                id="phone_number"
                className="form-control"
                value={user.phone_number}
                onChange={handleInputChange}
                readOnly={!isEditing}
                style={{
                  backgroundColor: isEditing ? "white" : "#e9ecef",
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label fw-semibold">
                Address
              </label>
              <textarea
                id="address"
                className="form-control"
                rows="3"
                value={user.address}
                onChange={handleInputChange}
                readOnly={!isEditing}
                style={{
                  backgroundColor: isEditing ? "white" : "#e9ecef",
                }}
              />
            </div>

            {/* Buttons */}
            {isEditing ? (
              <button
                type="button"
                className="btn btn-success w-100 py-2 fs-5 mt-3 text-uppercase"
                onClick={handleSaveClick}
              >
                Save Profile
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-success w-100 py-2 fs-5 mt-3 text-uppercase"
                onClick={handleEditClick}
                style={{
                  backgroundColor: "#2874f0",
                  borderColor: "#2874f0",
                }}
              >
                Edit Profile
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
</>
    );
};

export default Profile;
