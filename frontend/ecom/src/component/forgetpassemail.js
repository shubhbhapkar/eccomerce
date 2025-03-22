// src/PasswordReset.js

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent default form submission (and redirection)
  
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))?.split('=')[1];
  
      const response = await fetch('http://localhost:8000/accounts/password/reset/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRFToken': csrfToken,
        },
        body: new URLSearchParams({ email: email }).toString(),
      });
  
      // Check if the response is successful
      if (response.ok) {
        console.log('Password reset link sent! Check your email.', response);
        setMessage("Password reset link sent! Check your email.");
      } else {
        const errorData = await response.text();
        console.error('Error:', errorData);
        setMessage("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage("An error occurred. Please try again.");
    }
  };
  
  useEffect(() => {
    fetch('http://localhost:8000/user/csrf/', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    });
  }, []);

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Enter your email address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Send Reset Link
          </button>
        </form>
        {message && (
          <div className="alert mt-3" role="alert">
            {message}
          </div>
        )}
        <div className="text-center mt-3">
          <p>
            Remember your password? <NavLink to="/login" className="text-primary">Login here</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
