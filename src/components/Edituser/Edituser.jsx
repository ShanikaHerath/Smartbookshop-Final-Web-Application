import React, { useState, useEffect } from 'react';
import './Edituser.css';
import { useNavigate } from 'react-router-dom';

const UserDetails = () => {
  const [userData, setUserData] = useState({
    user_id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    address: '',
    phone: '', // Add this field

  });
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const Email = localStorage.getItem('user_email');
    fetch('http://localhost:5000/api/user-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email: Email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUserData(data.user);
        } else {
          setMessage('Error fetching user details.');
        }
      })
      .catch((error) => console.error('Error fetching user data:', error));
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Add state for OTP verification

  const handleEmailChange = (e) => {
    e.preventDefault();
    const email = userData.email;
    if (!email.includes('@gmail.com')) {
      setMessage('Please enter a valid email address with @gmail.com.');
      return;
    }
    if (email !== '') {
      setIsOtpSent(true);
      fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
        .then((response) => response.json())
        .then(() => setMessage('OTP sent to your new email!'))
        .catch(() => setMessage('Error sending OTP.'));
    }
  };
  

  const verifyOtp = () => {
    fetch('http://localhost:5000/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userData.email, otp }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage('Email verified successfully!');
          setIsOtpVerified(true);  // Mark OTP as verified
          setIsOtpSent(false);
        } else {
          setMessage('Invalid OTP.');
        }
      })
      .catch(() => setMessage('Error verifying OTP.'));
  };
// In handleSubmit function, prevent submitting if OTP isn't verified
const handleSubmit = (e) => {
  e.preventDefault();
  if (!isOtpVerified) {
    setMessage('Please confirm the changes and verify OTP before updating details.');
    return;
  }

  fetch('http://localhost:5000/api/update-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .then(() => {
      setMessage('User details updated successfully!');
      navigate('/login');
    })
    .catch(() => setMessage('Error updating user details.'));
};

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="user-details-container">
      <h1>Edit User Details</h1>
      <p className="note">NOTE: Please provide a valid email to receive OTP and updates.</p>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="user-details-form">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={userData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={userData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            required
          />
          {isOtpSent && (
            <div className="otp-verification">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
              <button type="button" onClick={verifyOtp} className="button-verify">
                Verify OTP
              </button>
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={userData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
  <label>Phone Number</label>
  <input
    type="text"
    name="phone"
    value={userData.phone || ''}
    onChange={handleInputChange}
    required
  />
</div>

        <div className="form-group password-group">
          <label>Password</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={userData.password}
              onChange={handleInputChange}
              required
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
        </div>
        <button type="submit" className="button-submit">
          Save Changes
        </button>
      </form>
      <button onClick={handleEmailChange} className="button-email-change">
        Confrim changes
      </button>
    </div>
  );
};

export default UserDetails;
