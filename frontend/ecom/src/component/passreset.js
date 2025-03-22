// src/PasswordReset.js

import { useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

const PasswordResetForm = () => {
  const { uid, token } = useParams(); // Extract uid and token from the URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Function to get CSRF token from cookies
  const getCsrfToken = () => {
    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrftoken='))?.split('=')[1];
    return csrfToken;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      setError("CSRF token missing.");
      return;
    }

    try {
      // Initial password reset request
      let response1 = await fetch(`http://localhost:8000/pass/${uid}/${token}/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          new_password1: newPassword,
          new_password2: confirmPassword,
        }),
      });

      // Check if password reset is successful
      if (response1.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login'); // Redirect to login after success
        }, 2000);
      } else {
        const errorData = await response1.text();
        setError(`Failed to reset password: ${errorData}`);
      }
    } catch (error) {
      setError('An error occurred during the password reset.');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center mb-4">Reset Your Password</h2>
        {success && <div className="alert alert-success" role="alert">Password reset successful! Redirecting to login...</div>}
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type="password"
              id="newPassword"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Reset Password</button>
        </form>
        <div className="text-center mt-3">
          <p>Remember your password? <NavLink href="/" className="text-primary">Login here</NavLink></p>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetForm;
