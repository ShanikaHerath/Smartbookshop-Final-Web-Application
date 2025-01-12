import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    password: '',
    confirm_password: '',
    phone: '', // New phone field

  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle for Password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for Confirm Password

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData }),
      });

      if (response.ok) {
        setMessage('OTP sent to your email!');
        setStep(2);
      } else {
        setMessage('Signup failed. Try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Something went wrong.');
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const result = await response.json();
      if (response.ok) {
        setIsSuccess(true);
        setMessage('Signup successful! Email verified.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setIsSuccess(false);
        setMessage(result.message || 'Invalid OTP.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Something went wrong.');
    }
  };

  return (
    <div className="signup-container">
      {step === 1 ? (
        <form className="signup-form" onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <p className="note">NOTE: Please provide a valid email to receive OTP and updates.</p>
          {message && <p className="message">{message}</p>}
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            <p className="note">
              Don't have an email?{' '}
              <a
                href="https://accounts.google.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="create-email-link"
              >
                Create one here
              </a>
            </p>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''} // Ensure backward compatibility
              onChange={handleChange}
              placeholder="Enter your phone number"
              pattern="[0-9]{10}" // Simple validation for 10-digit numbers
              required
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              required
            />
          </div>


          <div className="form-group password-group">
            <label>Password</label>
            <div className="input-with-icon">
              <input
                type={showPassword ? 'text' : 'password'} // Toggle between text and password
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <i
                className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} // FontAwesome icons
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
          <div className="form-group password-group">
            <label>Confirm Password</label>
            <div className="input-with-icon">
              <input
                type={showConfirmPassword ? 'text' : 'password'} // Toggle between text and password
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              <i
                className={showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} // FontAwesome icons
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
          </div>
          <button type="submit">Register</button>
        </form>
      ) : (
        <div className="otp-container">
          <h1>Verify Email</h1>
          <p>Enter the OTP sent to your email.</p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="otp-input"
            required
          />
          <button onClick={verifyOTP}>Verify OTP</button>
          {message && <p className={isSuccess ? 'message success' : 'message error'}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default Signup;
