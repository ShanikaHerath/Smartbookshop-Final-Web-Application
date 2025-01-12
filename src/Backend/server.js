// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { ask } = require('./Controllers/chatbot.js');
const nodemailer = require('nodemailer');

// Temporary storage for OTPs (In-memory store for the purpose of this example)
const temporaryOtpStore = {};

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static('public/images')); // Adjust the path as per your directory structure


// Create MySQL connection pool
const db = mysql.createPool({
  host: 'localhost', // Replace with your MySQL host
  user: 'root', // Replace with your MySQL username
  password: 'dineth@2005', // Replace with your MySQL password
  database: 'bookshop', // Replace with your MySQL database name
});

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
    connection.release();
  }
});

// Chatbot API
app.post('/api/chat', ask);

// Signup endpoint (Handles OTP sending and user registration)
app.post('/api/signup', async (req, res) => {
  const { first_name, last_name, email, address, password,phone  } = req.body;

  // Validate input
  if (!first_name || !last_name || !email || !address || !password|| !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if the email already exists
  const checkEmailQuery = 'SELECT * FROM user1 WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP temporarily (in-memory for example)
    temporaryOtpStore[email] = otp;

    // Send OTP to email using Nodemailer
    sendOtpEmail(email, otp);

    // Insert new user into the database (not yet activated until OTP is verified)
    const insertUserQuery = 'INSERT INTO user1 (first_name, last_name, email, address, password, phone) VALUES (?, ?, ?, ?, ?,?)';
    db.query(insertUserQuery, [first_name, last_name, email, address, password, phone], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      res.status(201).json({ message: 'User registered successfully. Please verify your email with the OTP.' });
    });
  });
});

let otpVerifiedUsers = {}; // Temporary storage to track verified emails

// Modify '/api/verify-otp' to update the OTP verification status
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (temporaryOtpStore[email] == otp) {
    delete temporaryOtpStore[email]; // Clear OTP after use
    otpVerifiedUsers[email] = true; // Mark OTP as verified for this email
    return res.json({ success: true, message: 'OTP verified successfully.' });
  } else {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
});
// New Send OTP endpoint (for email changes)
app.post('/api/send-otp', (req, res) => {
  const { email } = req.body;

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Save OTP temporarily (in-memory for example)
  temporaryOtpStore[email] = otp;

  // Send OTP to email using Nodemailer
  sendOtpEmail(email, otp)
    .then(() => {
      res.status(200).json({ message: 'OTP sent to your email' });
    })
    .catch(() => {
      res.status(500).json({ message: 'Failed to send OTP' });
    });
});


// Function to send OTP email
const sendOtpEmail = async (email, otp) => {
  try {
    console.log(`Sending OTP to: ${email}`); // Check if OTP sending is triggered
    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email provider here
      auth: {
        user: 'primedineth@gmail.com', // Your email address
        pass: 'arqk cnnh gdtd lbkk', // Your app-specific password
      },
    });

    // Define the email options
    const mailOptions = {
      from: 'primedineth@gmail.com', // Sender email
      to: email, // Recipient email
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`, // Email body text
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Endpoint to handle user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM user1 WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (results.length > 0) {
      return res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// API Endpoint to fetch items with category names
app.get('/api/items', (req, res) => {
  const query = `
      SELECT 
          i.item_name AS name,
          i.price AS price,
          c.category_name AS category,
          i.quantity,
          i.image AS image

      FROM item i
      JOIN category c ON i.category_id = c.category_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching items from the database');
    } else {
      res.json(results); // Send the results to the client
    }
  });
});



// POST: Insert multiple cart items with quantity into the database
app.post('/api/cart', (req, res) => {
  const { cartItems } = req.body;

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty or invalid." });
  }

  // Map the cart items to include quantity
  const values = cartItems.map(item => [item.email, item.item_name, item.item_price, item.date, item.quantity]);

  // Query to insert cart items with quantity into the database
  const query = "INSERT INTO cart2 (email, item_name, item_price, date, qty) VALUES ?";

  db.query(query, [values], (err, result) => {
    if (err) {
      console.error('Error inserting cart items:', err.message);
      return res.status(500).json({ message: "Failed to confirm cart." });
    }
    res.status(201).json({ message: "Cart confirmed successfully." });
  });
});

// POST: Add an item to the pending_cart table
app.post('/api/pending_cart', (req, res) => {
  const { email, item_name, item_price, date, quantity} = req.body;

  if (!email || !item_name || !item_price || !date || !quantity ) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = `
    INSERT INTO pending_cart (email, item_name, item_price, date, qty)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [email, item_name, item_price, date, quantity], (err, result) => {
    if (err) {
      console.error('Error inserting into pending_cart:', err);
      return res.status(500).json({ message: 'Failed to add to pending cart.' });
    }
    console.log('Item added to pending cart successfully', result);
    res.status(201).json({ message: 'Item added to pending cart successfully.' });
  });
});


// Endpoint to fetch pending cart items
app.get('/api/pending-cart/:email', (req, res) => {
  const email = req.params.email;

  const query = 'SELECT * FROM pending_cart WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching pending cart:', err);
      return res.status(500).json({ message: 'Failed to fetch pending cart' });
    }
    res.status(200).json(results);
  });
});
// Endpoint to delete an item from pending cart
app.delete('/api/pending-cart', (req, res) => {
  const { email, item_name } = req.body;

  const query = 'DELETE FROM pending_cart WHERE email = ? AND item_name = ?';
  db.query(query, [email, item_name], (err, result) => {
    if (err) {
      console.error('Error deleting item from pending cart:', err);
      return res.status(500).json({ message: 'Failed to delete item' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  });
});
// Endpoint to update the quantity of an item in pending cart
app.put('/api/pending-cart', (req, res) => {
  const { email, item_name, quantity } = req.body;

  const query = 'UPDATE pending_cart SET qty = ? WHERE email = ? AND item_name = ?';
  db.query(query, [quantity, email, item_name], (err, result) => {
    if (err) {
      console.error('Error updating quantity:', err);
      return res.status(500).json({ message: 'Failed to update quantity' });
    }
    res.status(200).json({ message: 'Quantity updated successfully' });
  });
});
// Endpoint to confirm cart by moving items from pending_cart to cart2
app.post('/api/confirm-cart', (req, res) => {
  const { email } = req.body;

  // First, get the pending cart items for the user
  const getPendingCartQuery = 'SELECT * FROM pending_cart WHERE email = ?';
  db.query(getPendingCartQuery, [email], (err, pendingCartItems) => {
    if (err) {
      console.error('Error fetching pending cart:', err);
      return res.status(500).json({ message: 'Failed to fetch pending cart' });
    }

    if (pendingCartItems.length === 0) {
      return res.status(400).json({ message: 'No items in pending cart' });
    }

    // Map the items to insert into cart2 table
    const values = pendingCartItems.map(item => [
      item.email,
      item.item_name,
      item.item_price,
      item.date,
      item.qty
    ]);

    // Insert the items into cart2 table
    const insertIntoCartQuery = 'INSERT INTO cart2 (email, item_name, item_price, date, qty) VALUES ?';
    db.query(insertIntoCartQuery, [values], (err, result) => {
      if (err) {
        console.error('Error inserting into cart2:', err);
        return res.status(500).json({ message: 'Failed to confirm cart' });
      }

      // If insertion is successful, remove items from pending_cart
      const deletePendingCartQuery = 'DELETE FROM pending_cart WHERE email = ?';
      db.query(deletePendingCartQuery, [email], (err, result) => {
        if (err) {
          console.error('Error deleting from pending_cart:', err);
          return res.status(500).json({ message: 'Failed to clear pending cart' });
        }

        // Send success response
        res.status(200).json({ message: 'Cart confirmed successfully' });
      });
    });
  });
});

// Fetch user details based on email

app.post('/api/user-details', (req, res) => {
  const { Email } = req.body;

  const query = 'SELECT * FROM user1 WHERE email = ?';
  db.query(query, [Email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Database error.' });
    }
    if (results.length > 0) {
      const { phone } = results[0]; // Include phone
      return res.status(200).json({ success: true, user: { ...results[0], phone } });
    } else {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
  });
});




// Modify '/api/update-user' to ensure OTP verification before update
app.post('/api/update-user', (req, res) => {
  const { user_id, first_name, last_name, email, password, address, phone } = req.body;

  // Check if email verification is successful
  if (!otpVerifiedUsers[email]) {
    return res.status(400).json({ message: 'Email not verified with OTP.' });
  }

  db.query(
    'UPDATE user1 SET first_name = ?, last_name = ?, email = ?, password = ?, address = ?, phone = ? WHERE user_id = ?',
    [first_name, last_name, email, password, address, phone, user_id],
    (err, results) => {
      if (err) return res.status(500).send('Database error');
      res.json({ message: 'User details updated successfully' });
    }
  );
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 
