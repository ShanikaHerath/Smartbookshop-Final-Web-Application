import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Shop.css';

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [email] = useState(localStorage.getItem("user_email") || "Guest");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = async (item, quantity = 1) => {
    const date = new Date().toISOString().split("T")[0];
    
    const newItem = {
      email: email,
      item_name: item.name,
      item_price: item.price,
      quantity: quantity,
      date,
    };
    
    try {
      await axios.post("http://localhost:5000/api/pending_cart", newItem);
      alert(`${item.name} has been added to your pending cart.`);
  
      setCartItems(prevItems => [
        ...prevItems,
        { ...newItem, quantity }, // Add new item with quantity
      ]);
    } catch (error) {
      console.error("Error adding item to pending cart:", error);
      alert("Failed to add item to pending cart. Please try again.");
    }
  };

  const handleViewCart = () => {
    navigate("/cart", { state: { cartItems } });
  };

  return (
    <div className="shop-container">
      <main>
        <section className="novels-section">
          <div className="container">
            <h1 className="section-title">Explore Our Collection</h1>
            <div className="filters">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="category-filter">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="TextBooks">TextBooks</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Novels">Novels</option>
                </select>
              </div>
            </div>
            {loading ? (
              <p className="loading">Loading items...</p>
            ) : (
              <div className="item-grid">
                {filteredItems.map((item, index) => (
                  <div key={index} className="item-card1">
                    <div className="content">
                      {item.image && (
                        <img
                          src={`http://localhost:5000/images/${item.image}`} // Updated image path
                          alt={item.name}
                          className="item-image"
                          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                        />
                      )}
                      <h3 className="item-title">{item.name}</h3>
                      <p className="category">Category: {item.category}</p>
                      <p className="price">LKR {Number(item.price).toFixed(2)}</p>
                      <p className="available-quantity">Available Quantity: {item.quantity}</p>
                      <button
                        className="btn add-to-cart"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <div
        className="cart-icon"
        onClick={handleViewCart}
        title="View Cart"
      >
        🛒 ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
      </div>
    </div>
  );
};

export default Shop; 

