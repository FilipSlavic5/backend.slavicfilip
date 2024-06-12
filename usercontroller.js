const User = require('./user');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const util = require("util");

exports.register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      
      email,
      password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error); // Isprintaj detalje o grešci
    res.status(500).json({ error: 'Failed to register user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
       
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error logging in:', error); // Isprintaj detalje o grešci
    res.status(500).json({ error: 'Server error' });
  }
};

