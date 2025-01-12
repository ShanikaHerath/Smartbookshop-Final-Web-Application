import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
        
            <main>
                <section className="hero">
                    <div className="hero-overlay"></div> {/* Semi-transparent overlay */}
                    <div className="hero-content">
                        <h1>Welcome to <span>Tharuka Bookshop</span></h1>
                        <p>BUY FIRST, PAY LATER !</p>
                        <p>Your one-stop destination for the best books and stationery.</p>
                        <Link to="/shop" className="btn-order">Shop Now</Link>
                    </div>
                </section>
            </main>
            <footer>
                <p>&copy; 2024 Tharuka Bookshop | Designed with ❤️</p>
            </footer>
        </div>
    );
}

export default Home;
