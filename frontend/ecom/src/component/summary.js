import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faCommentDots,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


const Summary =()=>{
    const [summaryData, setSummaryData] = useState({ products: 0, orders: 0, feedbacks: 0 });
   

    useEffect(() => {
        const fetchSummaryData = async () => {
          try {
            const response = await fetch("http://localhost:8000/user/summary/", {
              method: "GET",
              credentials: "include", // Ensure cookies are included
              headers: {
                "Content-Type": "application/json",
              },
            });
        
            if (!response.ok) {
              throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
        
            // Parse the response as JSON
            const responseData = await response.json();
        
            // Check if the "data" field exists in the response
            if (responseData && responseData.data) {
              // Update the summary data state correctly
              setSummaryData({
                products: responseData.data.productsCount,
                orders: responseData.data.ordersCount,
                feedbacks: responseData.data.feedbacksCount,
              });
            } else {
              throw new Error("Unexpected response format");
            }
          } catch (error) {
            console.error("Error fetching summary data:", error.message);
          }
        };
        
        fetchSummaryData();
    
       
      }, []); // Only run once on component mount
    
    return(
        <>
         
  <div className="row mt-4 text-center ps-xl-4">
  <h1 className="text-dark mb-4 text-center">Welcome to Your Dashboard</h1>

  <div className="col-md-4 col-sm-6 mb-4">
    <div
      className="card text-center shadow-sm border-0 rounded-3"
      style={{
        backgroundColor: "#28A65D",
        color: "#fff",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div className="card-body">
        <FontAwesomeIcon icon={faBoxOpen} size="4x" className="mb-3" />
        <h5 className="card-title fs-3">Products</h5>
        <p className="card-text fs-4">{summaryData.products}</p>
      </div>
    </div>
  </div>

  <div className="col-md-4 col-sm-6 mb-4">
    <div
      className="card text-center shadow-sm border-0 rounded-3"
      style={{
        backgroundColor: "#28A65D",
        color: "#fff",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div className="card-body">
        <FontAwesomeIcon icon={faShoppingCart} size="4x" className="mb-3" />
        <h5 className="card-title fs-3">Orders</h5>
        <p className="card-text fs-4">{summaryData.orders}</p>
      </div>
    </div>
  </div>

  <div className="col-md-4 col-sm-6 mb-4">
    <div
      className="card text-center shadow-sm border-0 rounded-3"
      style={{
        backgroundColor: "#28A65D",
        color: "#fff",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div className="card-body">
        <FontAwesomeIcon icon={faCommentDots} size="4x" className="mb-3" />
        <h5 className="card-title fs-3">Feedbacks</h5>
        <p className="card-text fs-4">{summaryData.feedbacks}</p>
      </div>
    </div>
  </div>
</div>

         </>
    )
}
export default Summary;