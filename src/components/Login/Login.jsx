import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            if (!email || !password) {
                setErrorMessage('Please fill in all fields.');
                return;
            }
            const response = await axios.post('http://localhost:5000/login', { email, password });
            alert(response.data.message);
            localStorage.setItem('user_email', email);
            navigate('/home');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Login failed. Try again.');
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h1>Tharuka Bookshop</h1>
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group password-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </span>
                    </div>
                </div>

                <button type="submit" className="login-button">Login</button>

               

                <p className="signup-link">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </form>

            {showForgotPassword && (
                <div className="forgot-password-modal">
                    <div className="modal-content">
                        <h2>Forgot Password</h2>
                        {resetMessage && <p className="reset-message">{resetMessage}</p>}
                        <form>
                            <div className="form-group">
                                <label htmlFor="resetEmail">Email</label>
                                <input
                                    type="email"
                                    id="resetEmail"
                                    placeholder="Enter your email to reset password"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="button" className="login-button">
                                Send Reset Link
                            </button>
                        </form>
                        <button
                            type="button"
                            className="close-modal-button"
                            onClick={() => setShowForgotPassword(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
