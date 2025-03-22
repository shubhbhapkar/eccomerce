

import React, { useEffect, useState } from "react";
import axios from "axios";
import addToCart from "./add to cart";
import ProductCard from "./productcard";
import './product.css'

const Products = ({ updateCartCount }) => {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  
  const [maxPrice, setMaxPrice] = useState(1000);
  const [currentMax, setCurrentMax] = useState(1000);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchProducts = async (page = 1) => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/user/product/?page=${page}`,
          { withCredentials: true }
        );

        setProducts(data.results); // Set current page products
        setOriginalProducts(data.results); // Use results for filtering
        setTotalPages(Math.ceil(data.count / 10)); // Assume 10 products per page

        const prices = data.results.map((p) => p.discounted_price || p.price);
       
        setMaxPrice(Math.max(...prices));
       
        setCurrentMax(Math.max(...prices));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts(currentPage);
  }, [currentPage]);

  const handleFilter = () => {
    const filtered = originalProducts.filter((product) => {
      const price = product.discounted_price || product.price;
      return price >= 0 && price <= currentMax;
    });
    setProducts(filtered);
  };

  const handleReset = () => {
    setProducts(originalProducts);
   
    setCurrentMax(maxPrice);
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <div className="text-left container py-5 text-dark">
        <h1 className="mt-4 mb-5 text-left">
          <strong>Bestsellers</strong>
        </h1>
        <div className="row mb-4 text-right align-items-right">
         <div className="col-md-6"></div>
          <div className="col-md-3 text-right">
            <label htmlFor="maxRange" className="form-label fw-bold text-dark">
              Max Price: <span className="text" style={{color:"#28A65D"}}>${currentMax}</span>
            </label>
            <input
              id="maxRange"
              type="range"
              className="form-range custom-range"
              min={0}
              max={maxPrice}
              value={currentMax}
              onChange={(e) => setCurrentMax(Number(e.target.value))}
            />
          </div>
          <div className="col-md-3 text-center mt-3 mt-md-0">
            <button className="btn  me-2 text-light" onClick={handleFilter} style={{backgroundColor:"#28A65D"}}>
              Apply Filter
            </button>
            <button className="btn btn-outline-dark" onClick={handleReset}>
              Reset Filter
            </button>
          </div>
        </div>

        {/* Product Cards */}
        <div className="row">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              updateCartCount={updateCartCount}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls mt-4 text-center">
          <button
            className="btn btn-outline-primary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline-primary ms-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default Products;
