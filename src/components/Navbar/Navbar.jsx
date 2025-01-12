import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaComments, FaUser, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'; // Import icons
import './Navbar.css';
import Chatbot from '../Chatbot/chatbot.jsx';

const Navbar = () => {
    const navigate = useNavigate(); // Initialize navigation hook

    const handleViewCart = () => {
        navigate('/cart'); // Navigate to the cart page
    };

    const handleEditUserDetails = () => {
        navigate('/edituser'); // Navigate to the edit user details page
    };
    

    return (
        <header className="header1">
            <div className="container">
                <div className="top-bar">
                    <div className="contact-info">
                        <div className="contact-item">
                        <FaPhoneAlt size={18} />

                            <a href="123456789" title="Call Us">
                                <span> 123456789</span>
                            </a>
                        </div>
                        <div className="contact-item">
                        <FaEnvelope size={18} />

                            <a href="bookshop@gmail.com" title="Email Us">
                                <span>bookshop@gmail.com</span>
                          </a>
                        </div>
                        <div className="contact-item">
                        <FaMapMarkerAlt size={18} />

                            <a
                                href="https://www.google.com/maps?q=Melsiripura,+Kurunegala,+Sri+Lanka"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View on Map"
                            >
                                <span>Location</span>
                            </a>
                        </div>
                    </div>
                    <nav>
                        <ul className="nav-links">
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/shop">Shop</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/login">Logout</Link></li>
                            <li>
                                <button 
                                    className="user-icon22" 
                                    onClick={handleEditUserDetails} 
                                    title="Edit Profile"
                                >
                                    <FaUser size={24} />
                                </button>
                            </li>
                            <li>
                                {/* Chatbot Component */}
                                <Chatbot />
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
