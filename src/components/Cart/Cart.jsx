import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaCheckCircle, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const email = localStorage.getItem("user_email");

  // Fetch pending cart items on component load
  useEffect(() => {
    const fetchPendingCart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pending-cart/${email}`);
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching pending cart items:", error);
      }
    };

    fetchPendingCart();
  }, [email]);

  // Delete an item from the cart
  const handleDeleteItem = async (item_name) => {
    try {
      await axios.delete("http://localhost:5000/api/pending-cart", {
        data: { email, item_name },
      });
      setCartItems(cartItems.filter((item) => item.item_name !== item_name));
      alert("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    }
  };

  // Update item quantity
  const handleQuantityChange = async (item_name, delta) => {
    const item = cartItems.find((item) => item.item_name === item_name);
    const newQuantity = Math.max(1, item.qty + delta);

    try {
      await axios.put("http://localhost:5000/api/pending-cart", {
        email,
        item_name,
        quantity: newQuantity,
      });
      setCartItems(
        cartItems.map((item) =>
          item.item_name === item_name ? { ...item, qty: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    }
  };

  // Confirm the cart and move items to cart2
  const handleConfirmCart = async () => {
    try {
      // Send the email and confirm the cart
      await axios.post("http://localhost:5000/api/confirm-cart", { email });
      setIsOrderConfirmed(true);
      setCartItems([]); // Clear cart items from the UI
    } catch (error) {
      console.error("Error confirming cart:", error);
      alert("Failed to confirm cart.");
    }
  };

  return (
    <div className="cart-container">
      <h1>
        <FaShoppingCart className="cart-icon" /> Your Cart
      </h1>
      {cartItems.length === 0 ? (
        isOrderConfirmed ? (
          <p className="order-confirmation">
            Your order has been confirmed! We will deliver it with our <strong>Cash on Delivery</strong> service. Thank you!
          </p>
        ) : (
          <p className="empty-cart">Your cart is empty.</p>
        )
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              <div className="cart-item">
                <div>
                  <h3>{item.item_name}</h3>
                  <p>LKR {Number(item.item_price).toFixed(2)}</p>
                  <p className="cart-date">{item.date} at {item.time}</p>
                  <div className="quantity-control">
                    <button
                      className="btn quantity-btn"
                      onClick={() => handleQuantityChange(item.item_name, -1)}
                      title="Decrease Quantity"
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity-display">{item.qty}</span>
                    <button
                      className="btn quantity-btn"
                      onClick={() => handleQuantityChange(item.item_name, 1)}
                      title="Increase Quantity"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <p>Total: LKR {(item.item_price * item.qty).toFixed(2)}</p>
                </div>
                <button
                  className="btn delete-btn"
                  onClick={() => handleDeleteItem(item.item_name)}
                  title="Delete Item"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {cartItems.length > 0 && (
        <>
          <p className="cash-on-delivery">
            Note: This service is <strong>Cash on Delivery</strong>. You will pay upon receiving your order.
          </p>
          <div className="confirm-cart">
            <button className="btn confirm-btn" onClick={handleConfirmCart}>
              <FaCheckCircle className="confirm-icon" /> Confirm Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
