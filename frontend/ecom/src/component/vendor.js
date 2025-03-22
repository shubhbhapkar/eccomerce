import React, { useEffect, useState } from "react";
import Navbar from "./vendorNavbar";
import Dashboard from "./dashboard"

const Vendor = () => {
    const [status, setStatus] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        business_name: "",
        business_address: "",
        phone_no: "",
        tax_id_number: "",
        gst_vat_registration: "",
        bank_account_holder_name: "",
        account_number: "",
        bank_code: "",
    });
    const [adharCardFile, setAdharCardFile] = useState(null);
    const [panCardFile, setPanCardFile] = useState(null);

    useEffect(() => {
        const getKycStatus = async () => {
            try {
                const response = await fetch('http://localhost:8000/user/kycstatus/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                if (data && data.status) {
                    setStatus(data.status);
                } else {
                    setStatus('declined'); // Default to 'declined' if no status is found
                }
            } catch (error) {
                console.error('Error fetching KYC status:', error);
            }
        };
        getKycStatus();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === "adhar_card") {
            setAdharCardFile(files[0]);
        } else if (name === "pan_card") {
            setPanCardFile(files[0]);
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    const submitFormData = new FormData();
    Object.keys(formData).forEach((key) => {
        submitFormData.append(key, formData[key]);
    });

    if (adharCardFile) submitFormData.append("adhar_card", adharCardFile);
    if (panCardFile) submitFormData.append("pan_card", panCardFile);

    try {
        const response = await fetch('http://localhost:8000/user/kyc/', {
            method: 'POST',
            credentials: 'include', // Ensures cookies are sent
            headers: {
                'X-CSRFToken': getCsrfToken(), // Include CSRF token
            },
            body: submitFormData,
        });

        if (response.ok) {
            alert("Form submitted successfully!");
            setStatus("pending")
            setShowModal(false)
        } else {
            alert("Failed to submit form.");
        }
       
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};

// Utility to get CSRF token from cookies
const getCsrfToken = () => {
    const name = 'csrftoken';
    const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith(name + '='))
        ?.split('=')[1];
    return cookieValue || '';
};

    return (
        <>
       
         
                {status === 'verified' && <Dashboard/>}
                {status === 'pending' && (
  <div
    style={{
      backgroundColor: '#28A65D', // Orange background color
      color: '#fff', // White text for contrast
      padding: '20px',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '500',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Light shadow for better visibility
      marginBottom: '20px', // Add margin at the bottom for spacing
      textAlign: 'center', // Center the text
    }}
  >
    <strong className="text-light">Your form is in the process of verification. Once verified, you will be able to proceed further.</strong>
  </div>
)}

                {status === "declined" && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center"
          role="alert"
          style={{
            backgroundColor: "#f8d7da",
            borderColor: "#f5c6cb",
            color: "#721c24",
            borderRadius: "0.375rem",
            padding: "20px",
            fontSize: "16px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <span>
            You need to go through KYC to add products. If you have submitted
            KYC, it was declined. You need to fill the KYC form again with valid
            details.
          </span>
          <button
            className="btn btn-success"
            onClick={() => setShowModal(true)}
            style={{ backgroundColor: "#28A65D", borderColor: "#28A65D" }}
          >
            Update KYC
          </button>
        </div>
      )}

      {showModal && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div
              className="modal-content"
              style={{
                backgroundColor: "#28A65D",
                color: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="modal-header" style={{ borderBottom: "none" }}>
                <h3 className="modal-title">Update KYC Information</h3>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body" style={{ padding: "30px" }}>
                <form
                  onSubmit={handleSubmit}
                  className="row g-4"
                  encType="multipart/form-data"
                >
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      name="business_name"
                      placeholder="Business Name"
                      value={formData.business_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      name="business_address"
                      placeholder="Business Address"
                      value={formData.business_address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      name="phone_no"
                      placeholder="Phone Number"
                      value={formData.phone_no}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      name="tax_id_number"
                      placeholder="Tax ID Number"
                      value={formData.tax_id_number}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6"> 
                    <input
                      type="text"
                      className="form-control"
                      name="gst_vat_registration"
                      placeholder="GST/VAT Registration"
                      value={formData.gst_vat_registration}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Adhar Card</label>
                    <input
                      type="file"
                      className="form-control"
                      name="adhar_card"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                  <label>Pan Card</label>
                    <input
                      type="file"
                      className="form-control"
                      name="pan_card"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      name="bank_account_holder_name"
                      placeholder="Bank Account Holder Name"
                      value={formData.bank_account_holder_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      name="account_number"
                      placeholder="Account Number"
                      value={formData.account_number}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      name="bank_code"
                      placeholder="Bank Code"
                      value={formData.bank_code}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-light w-100"
                      style={{ backgroundColor: "#f8f9fa", color: "#28A65D" }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="modal-footer" style={{ borderTop: "none" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  style={{ backgroundColor: "#6c757d" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}        
      </>
    );
};

export default Vendor;
