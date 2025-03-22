// src/LoginPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './slider.css';
import './login.css';
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [message,setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginData = { username, password };
        console.log('Logging in with:', loginData);

        try {
            const response = await fetch('http://localhost:8000/user/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
                credentials:'include',
            });
            if (response.ok) {
                const data = await response.json();

                sessionStorage.setItem('user', JSON.stringify({ username: data.username, isLoggedIn: true }));

                console.log('Login successful:', data);

                setTimeout(() => {
                    // navigate('/');
                    if(data.is_vendor){
                      navigate('/vendor')
                    }else{
                      navigate('/')
                    }
                  
                }, 10);
            }
            if (!response.ok) {
                setMessage("Enter correct username or password")
                throw new Error('Login failed!');
                
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div
  style={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0",
    backgroundColor: "#f1f3f6",
  }}
>
  <div
    className="text-center bg-white shadow rounded"
    style={{
      width: "90%",
      maxWidth: "400px",
      padding: "2rem",
      borderRadius: "8px",
      boxSizing: "border-box",
    }}
  >
    {/* Login Title */}
    <h2 className="text-dark mb-4" style={{ fontWeight: "600" }}>
      Login
    </h2>

    <form onSubmit={handleLogin}>
      {/* Username Field */}
      <label className="text-secondary fw-bold mb-2" style={{ float: "left" }}>
        Username
      </label>
      <input
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setMessage("");
        }}
        required
        placeholder="Enter your username"
        className="form-control rounded"
        style={{
          padding: "0.8rem",
          border: "1px solid #dcdcdc",
          marginBottom: "1rem",
        }}
      />

      {/* Password Field */}
      <label className="text-secondary fw-bold mb-2" style={{ float: "left" }}>
        Password
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setMessage("");
        }}
        required
        placeholder="Enter your password"
        className="form-control rounded"
        style={{
          padding: "0.8rem",
          border: "1px solid #dcdcdc",
          marginBottom: "1.5rem",
        }}
      />

      {/* Buttons */}
      <div className="d-flex justify-content-between">
        <button
          type="submit"
          className="btn btn-primary w-48"
          style={{
            width: "48%",
            padding: "0.8rem",
            fontWeight: "500",
            fontSize: "14px",
            backgroundColor: "#2874f0",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Login
        </button>
        <button
          type="button"
          className="btn btn-secondary w-48"
          style={{
            width: "48%",
            padding: "0.8rem",
            fontWeight: "500",
            fontSize: "14px",
            backgroundColor: "#f1f3f6",
            color: "#2874f0",
            border: "1px solid #2874f0",
            borderRadius: "4px",
          }}
          onClick={() => {
            setUsername("");
            setPassword("");
          }}
        >
          Clear
        </button>
      </div>
    </form>

    {/* Error Message */}
    <span className="text-danger mt-3 d-block">{message}</span>

    {/* Additional Links */}
    <p className="mt-4 text-secondary">
      Don't have an account?{" "}
      <Link
        to="/register"
        className="text-primary fw-bold"
        style={{ textDecoration: "none" }}
      >
        Register here
      </Link>
    </p>
    <p>
      <Link
        to="/password"
        className="text-primary text-decoration-underline"
        style={{ fontSize: "14px" }}
      >
        Forgot Password?
      </Link>
    </p>
  </div>
</div>
    );
};

export default LoginPage;
