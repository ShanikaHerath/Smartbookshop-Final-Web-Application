import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './About.css';

const About = () => {
  return (
    <>

      <div className="about-section">
        <div className="about-content">
          <h1>About Tharuka Bookshop</h1>
          <h2>Who We Are</h2>
          <p>
            Welcome to Tharuka Bookshop! We are dedicated to providing a wide
            range of products, including books, stationery, and other supplies,
            with exceptional service and a commitment to customer satisfaction. 
            Whether you're a student, a professional, or a book lover, we have 
            something special for everyone.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            Our mission is to promote learning and creativity by offering
            quality products at affordable prices. We aim to create a one-stop
            shop for all your academic and artistic needs.
          </p>
          <h2>Find Us Here</h2>
          <div className="map-container">
            <iframe
              title="store-location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019376194809!2d144.9537353153157!3d-37.81627937975161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf57769b5485aa215!2sVictoria%20Harbour%2C%20Melbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2sus!4v1589383801695!5m2!1sen!2sus"
              width="100%"
              height="450"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
            ></iframe>
          </div>
          <div className="contact-info1">
            <h2>Contact Us</h2>
            <p>Email: <a href="mailto:info@tharukabookshop.com">info@tharukabookshop.com</a></p>
            <p>Phone: <a href="tel:+94112345678">+94 752 439 487</a></p>
            <p>Facebook: <a href="https://www.facebook.com/tharukabookshop" target="_blank" rel="noopener noreferrer">facebook.com/tharukabookshop</a></p>
          </div>
          <Link to="/shop" className="btn-order-now">Order Now</Link>
  
        </div>
      </div>
    </>
  );
};

export default About;
