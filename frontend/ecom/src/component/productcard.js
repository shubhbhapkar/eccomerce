// src/components/ProductCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart,faGift } from '@fortawesome/free-solid-svg-icons';


const ProductCard = ({ product, addToCart,updateCartCount}) => {
  
  return (

<div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product.id}>
  <div
    className="card h-100 border-0 shadow-sm text-start"
    style={{
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      cursor: "pointer",
    }}
  >
    {/* Product Image */}
    <div
      className="position-relative"
      style={{
        width: "100%",
        height: "240px",
        overflow: "hidden",
        borderRadius: "12px 12px 0 0",
      }}
      onClick={() => window.location.href = `/product/${product.id}`}
    >
      {/* Discount Badge */}
      {product.discount > 0 && (
        <span
          className="badge text-white position-absolute"
          style={{
            fontSize: "0.60rem",
            padding: "4px 8px",
            borderRadius: "",
            backgroundColor: "black",
            top: "0px",
            left: "0px",
          }}
        >
          {product.discount}% OFF <FontAwesomeIcon icon={faGift} className=' text-warning'/>
        </span>
      )}
      <img
        src={`http://127.0.0.1:8000${product.product_colors[0].image_url}`}
        className="w-100 h-100"
        alt={product.productname}
        style={{ objectFit: "cover" }}
      />
    </div>

    {/* Product Details */}
    <div className="card-body text-center p-3">
      {/* Product Name */}
      <Link
        to={`/product/${product.id}`}
        className="text-dark text-decoration-none"
      >
        <h5
          className="card-title mb-2 text-truncate"
          style={{
            fontSize: "25px",
            fontWeight: "bold",
            lineHeight: "1.4",
            color:"#28A65D"
          }}
        >
          {product.productname}
        </h5>
      </Link>

      {/* Product Description */}
          <p
          className="text-muted mb-2"
          style={{
            fontSize: "0.8rem",
            lineHeight: "1.4",
          }}
        >
           `${product.description.slice(0, 85)}...`
         
    </p>
      {/* Pricing and Add to Cart in Single Row */}
      <div className="card-footer d-flex justify-content-between align-items-center mt-4">
        {/* Pricing */}
        <div className="d-flex align-items-center">
          {product.discount > 0 && (
            <span
              className="text-muted small me-2"
              style={{
                textDecoration: "line-through",
                fontSize: "0.8rem",
              }}
            >
              ${product.price}
            </span>
          )}
          <strong
            className="text-success"
            style={{
              fontSize: "0.9rem",
            }}
          >
            ${product.discounted_price}
          </strong>
        </div>

        {/* Add to Cart Button */}
        <button
          className="btn btn-sm bg-success"
          style={{
            backgroundColor:"",
            color: "white",
            fontSize: "0.8rem",
            padding: "5px 12px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
          onClick={() => {
            addToCart(product);
            updateCartCount(1);
          }}
        >
          <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
          Add
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default ProductCard;
