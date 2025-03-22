// // src/RegistrationPage.js

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';


// const RegistrationPage = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         username: '',
//         email: '',
//         name: '',
        
//         phone_number: '',
//         address: '',
        
//         password1: '',
//         password2: '',
//     });

//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//         // Check if passwords match
//         if (formData.password1 !== formData.password2) {
//             setError('Passwords do not match');
//             return;
//         }

//         try {
//             const response = await fetch('http://localhost:8000/user/registration/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });

//             if (response.ok) {
//                 setSuccess('Registration successful! Redirecting to login...');
//                 // Redirect to the login page after a successful registration
//                 setTimeout(() => {
//                     navigate('/login');
//                 }, 2000);
//             } else {
//                 const errorData = await response.json();
//                 setError(errorData.detail || 'Registration failed');
//             }
//         } catch (err) {
//             setError('An error occurred during registration');
//         }
//     };

//     return (
//         <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f4f7fc" }}>
//             <div className="border rounded border-light p-5 shadow-lg bg-white w-100" style={{ maxWidth: "500px" }}>
//             <h2 className="text-center mb-3   text-dark">Register Here!</h2>
        
//                     {error && <p className="text-danger">{error}</p>}
//                     {success && <p className="text-success">{success}</p>}

//                     <form onSubmit={handleSubmit}>
//                         <div className="row mb-3">
//                             <div className="col-12 col-md-6">
//                                 <label htmlFor="username" className="form-label">Username</label>
//                                 <input
//                                     type="text"
//                                     name="username"
//                                     id="username"
//                                     className="form-control"
//                                     placeholder="Username"
//                                     value={formData.username}
//                                     onChange={handleChange}
//                                     required
//                                     style={{ borderColor: '#4a90e2' }}
//                                 />
//                             </div>
//                             <div className="col-12 col-md-6">
//                                 <label htmlFor="email" className="form-label">Email</label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     id="email"
//                                     className="form-control"
//                                     placeholder="Email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     required
//                                     style={{ borderColor: '#4a90e2' }}
//                                 />
//                             </div>
//                         </div>

//                         <div className="row mb-3">
//                             <div className="col-12 col-md-6">
//                                 <label htmlFor="first_name" className="form-label">First Name</label>
//                                 <input
//                                     type="text"
//                                     name="first_name"
//                                     id="first_name"
//                                     className="form-control"
//                                     placeholder="First Name"
//                                     value={formData.first_name}
//                                     onChange={handleChange}
//                                     required
//                                     style={{ borderColor: '#4a90e2' }}
//                                 />
//                             </div>
//                             <div className="col-12 col-md-6">
//                                 <label htmlFor="last_name" className="form-label">Last Name</label>
//                                 <input
//                                     type="text"
//                                     name="last_name"
//                                     id="last_name"
//                                     className="form-control"
//                                     placeholder="Last Name"
//                                     value={formData.last_name}
//                                     onChange={handleChange}
//                                     required
//                                     style={{ borderColor: '#4a90e2' }}
//                                 />
//                             </div>
//                         </div>

//                         <div className="row mb-3">
//                             <div className="col-12 col-md-6">
//                                 <label htmlFor="phone_number" className="form-label">Phone No.</label>
//                                 <input
//                                     type="text"
//                                     name="phone_number"
//                                     id="phone_number"
//                                     className="form-control"
//                                     placeholder="Phone Number"
//                                     value={formData.phone_number}
//                                     onChange={handleChange}
//                                     required
//                                     style={{ borderColor: '#4a90e2' }}
//                                 />
//                             </div>
//                             <div className="col-12 col-md-6">
//                                 <label htmlFor="address" className="form-label">Residential Address</label>
//                                 <input
//                                     type="text"
//                                     name="address"
//                                     id="address"
//                                     className="form-control"
//                                     placeholder="Address"
//                                     value={formData.address}
//                                     onChange={handleChange}
//                                     required
//                                     style={{ borderColor: '#4a90e2' }}
//                                 />
//                             </div>
//                         </div>

//                         <div className="row mb-3">
//                             <div className="col-12 col-md-6">
//                                 <label htmlFor="password1" className="form-label">Password</label>
//                                 <input
//                                     type="password"
//                                     name="password1"
//                                     id="password1"
//                                     className="form-control"
//                                     placeholder="Password"
//                                     value={formData.password1}
//                                     onChange={handleChange}
//                                     required
//                                     style={{ borderColor: '#4a90e2' }}
//                                 />
//                             </div>
//                             <div className="col-12 col-md-6">
//                                 <label htmlFor="password2" className="form-label">Confirm Password</label>
//                                 <input
//                                     type="password"
//                                     name="password2"
//                                     id="password2"
//                                     className="form-control"
//                                     placeholder="Confirm Password"
//                                     value={formData.password2}
//                                     onChange={handleChange}
//                                     required
//                                     style={{ borderColor: '#4a90e2' }}
//                                 />
//                             </div>
//                         </div>

//                         <div className="row mb-3">
//                             <div className="col-12 col-md-6">
//                                 <h4 htmlFor="is_vendor" className="form-label">Register As</h4>
//                                 <label>User</label>
//                                 <input
//                                     type="radio"
//                                     name="is_vendor"
//                                     id="is_vendor"
//                                     className="form-control"
                                   
//                                     value={formData.is_vendor = true}
//                                     onChange={handleChange}
                                    
//                                     required
//                                     style={{ borderColor: '#4a90e2' }}
//                                 />
//                                 <label>vendor</label>
//                                 <input
//                                     type="radio"
//                                     name="is_vendor"
//                                     id="is_vendor"
//                                     className="form-control"
                                   
//                                     value={formData.is_vendor = false}
//                                     onChange={handleChange}
//                                     required
//                                     style={{ borderColor: '#4a90e2' }}
//                                 />
//                             </div>
//                         </div>

//                         <div className="text-center">
//                             <button type="submit" className="btn btn-outline-primary w-100 mt-4" style={{ borderRadius: "25px" }}>Register</button>
//                         </div>
//                     </form>

//                     <p className="mt-4 text-center">
//                         Already have an account? <Link to="/login" className="text-decoration-none text-primary fw-bold">Login here</Link>
//                     </p>
//              </div>
//         </div>

//      );
// };
// export default RegistrationPage;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const RegistrationPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        name: '',
        
        phone_number: '',
        address: '',
        password1: '',
        password2: '',
        is_vendor: false, // Default to false (User registration)
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'radio' ? value === 'true' : value, // Explicitly handle boolean for radio buttons
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Check if passwords match
        if (formData.password1 !== formData.password2) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/user/registration/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Registration failed');
                console.log(errorData)
            }
        } catch (err) {
            setError('An error occurred during registration');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f4f7fc" }}>
            <div className="border rounded border-light p-5 shadow-lg bg-white w-100" style={{ maxWidth: "500px" }}>
                <h2 className="text-center mb-3 text-dark">Register Here!</h2>

                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}

                <form onSubmit={handleSubmit}>
                    {/* User and Vendor Input Fields */}
                    <div className="row mb-3">
                        <div className="col-12 col-md-6">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className="form-control"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                style={{ borderColor: '#4a90e2' }}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="form-control"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{ borderColor: '#4a90e2' }}
                            />
                        </div>
                    </div>

                    {/* Name Fields */}
                    <div className="row mb-3">
                        <div className="col-12 col-md-6">
                            <label htmlFor="name" className="form-label">First Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form-control"
                                placeholder="First Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{ borderColor: '#4a90e2' }}
                            />
                        </div>
                        
                    </div>

                    {/* Contact Details */}
                    <div className="row mb-3">
                        <div className="col-12 col-md-6">
                            <label htmlFor="phone_number" className="form-label">Phone No.</label>
                            <input
                                type="text"
                                name="phone_number"
                                id="phone_number"
                                className="form-control"
                                placeholder="Phone Number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                                style={{ borderColor: '#4a90e2' }}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <label htmlFor="address" className="form-label">Residential Address</label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                className="form-control"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                style={{ borderColor: '#4a90e2' }}
                            />
                        </div>
                    </div>

                    {/* Password Fields */}
                    <div className="row mb-3">
                        <div className="col-12 col-md-6">
                            <label htmlFor="password1" className="form-label">Password</label>
                            <input
                                type="password"
                                name="password1"
                                id="password1"
                                className="form-control"
                                placeholder="Password"
                                value={formData.password1}
                                onChange={handleChange}
                                required
                                style={{ borderColor: '#4a90e2' }}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <label htmlFor="password2" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="password2"
                                id="password2"
                                className="form-control"
                                placeholder="Confirm Password"
                                value={formData.password2}
                                onChange={handleChange}
                                required
                                style={{ borderColor: '#4a90e2' }}
                            />
                        </div>
                    </div>

                    {/* Radio Buttons for is_vendor */}
                    <div className="mb-3 d-flex">
                        <label className='fw-bold'>Register As:</label>
                        <div className='ms-3'>
                            <label>
                                <input
                                    type="radio"
                                    name="is_vendor"
                                    value={false} // User registration
                                    checked={formData.is_vendor === false}
                                    onChange={handleChange}
                                    required
                                />
                                User
                            </label>
                            <br />
                            <label>
                                <input
                                    type="radio"
                                    name="is_vendor"
                                    value={true} // Vendor registration
                                    checked={formData.is_vendor === true}
                                    onChange={handleChange}
                                    required
                                />
                                Vendor
                            </label>
                        </div>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-outline-primary w-100 mt-4" style={{ borderRadius: "25px" }}>Register</button>
                    </div>
                </form>

                <p className="mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-decoration-none text-primary fw-bold">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default RegistrationPage;
