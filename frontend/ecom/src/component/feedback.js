import React,{useState,useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Navbar from "./vendorNavbar";
const FeedbackList = () => {

    const [feedbacks,setFeedbacks] = useState([])

    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchFeedbacks = async () => {
        try {
          // Get CSRF token from cookies
          const csrfToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("csrftoken="))
            ?.split("=")[1];
  
          // Make the GET request
          const response = await axios.get(
            "http://localhost:8000/user/feedbackvendor/",
            {
              headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken, // Include CSRF token if required
              },
              withCredentials: true, // Ensures cookies are sent with the request
            }
          );
  
          // Update the state with the response data
          setFeedbacks(response.data.data.feedbacks);
        } catch (err) {
          console.error("Error fetching feedbacks:", err);
          setError("Failed to fetch feedbacks. Please try again later.");
        }
      };
  
      fetchFeedbacks();
    }, []);
  
    if (error) {
      return <div className="alert alert-danger text-center">{error}</div>;
    }
  
  return (
    <>
    <div className="d-flex">
      <Navbar/>
    <div className="container my-5">
      <h2 className="text-center text-uppercase fw-bold text-success mb-4">
        Customer Feedbacks
      </h2>
      <div className="row">
        {feedbacks.map((feedback) => (
          <div className="col-md-6 col-lg-4 mb-4" key={feedback.id}>
            <div className="card border-success shadow-sm h-100">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Feedback #{feedback.id}</h5>
                <p className="mb-0 text-light">
                  <strong>User:</strong> {feedback.user}
                </p>
              </div>
              <div className="card-body">
                <p>
                  <strong>Order ID:</strong> {feedback.order_id}
                </p>
                <p>
                  <strong>Feedback:</strong> {feedback.feedback}
                </p>
              </div>
              <div className="card-footer bg-light text-center">
                <span className="text-success fw-bold">Thank you for your feedback!</span>
              </div>
            </div>
          </div>
        ))}
        {feedbacks.length === 0 && (
          <div className="col-12">
            <p className="text-muted text-center">No feedbacks available.</p>
          </div>
        )}
      </div>
    </div>
    </div>
    </>
  );
};

export default FeedbackList;
