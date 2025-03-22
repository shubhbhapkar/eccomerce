import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/user/viewcat/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include credentials (cookies) in the request
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data); // Assuming `data` is an array of categories
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/products/${categoryName}`); // Navigate to the category page
  };

  return (
    <div className="container my-5">
  <h1 className="text-left mb-4 text-dark">Explore Product Categories</h1>
  <div className="row">
    {categories.map((category) => (
      <div
        className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4"
        key={category.id} // Use unique ID from the API response
      >
        <div
          className="card h-100 border-0 text-center p-3"
          onClick={() => handleCategoryClick(category.name)}
          style={{
            cursor: "pointer",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            transition: "transform 0.2s ease-in-out",
          }}
        >
          {/* Category Image */}
          <img
            src={category.image || "placeholder-image.jpg"} // Replace with your placeholder if image is missing
            alt={category.name}
            className="img-fluid mx-auto"
            style={{
              borderRadius: "50%",
              width: "100px",
              height: "100px",
              objectFit: "cover",
            }}
          />
          {/* Category Name */}
          <h6
            className="mt-3 mb-0 fw-bold" 
            style={{ fontWeight: "600", fontSize: "14px" ,color:"#28A65D"}}
          >
            {category.name}
          </h6>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default ProductCategories;


