import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home.jsx';
import About from './components/About/About.jsx';
import Shop from './components/Shop/Shop.jsx';
import Signup from './components/Signup/Signup.jsx';
import Login from './components/Login/Login.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Welcome from './components/Welcome/Welcome.jsx';
import Cart from './components/Cart/Cart.jsx';
import Chatbot from './components/Chatbot/chatbot.jsx';
import Edituser from './components/Edituser/Edituser.jsx';

const AppRoutes = () => {
  const location = useLocation();

  // Explicitly exclude Navbar for login and signup routes
  const showNavbar = !['/login', '/signup', '/'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/edituser" element={<Edituser />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </>
  );
};

const Snowfall = () => {
  const numSnowflakes = 200;

  const createSnowflakes = () => {
    let snowflakes = [];
    for (let i = 0; i < numSnowflakes; i++) {
      const size = Math.random() * 10 + 5;
      const leftPosition = Math.random() * 100;
      const animationDuration = Math.random() * 10 + 5;

      snowflakes.push(
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${leftPosition}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${animationDuration}s`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        ></div>
      );
    }
    return snowflakes;
  };

  return <div className="snowfall">{createSnowflakes()}</div>;
};

function App() {
  return (
    <Router>
      <div className="App">
        <div className="background-overlay"></div>
        <Snowfall />
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
