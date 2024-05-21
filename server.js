const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = require('./usercontroller');
const Profile = require('./profile');
const Message = require('./message');
const User = require('./user');
const Task = require('./models/task'); 
const FriendRequest = require('./models/friendrequest');  

const app = express();
const PORT = process.env.PORT || 3000;
const userSocketMap = new Map();

function findUserSocketIdByEmail(email) {
  return userSocketMap.get(email);
}

app.use(bodyParser.json());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:8080',  // Ovo dozvoljava zahtjeve samo s ovog porijekla
  methods: ['GET', 'POST', 'PATCH'],  // Trebate dodati 'PATCH' ovdje
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// MongoDB connection
mongoose.connect('mongodb+srv://fslavic:nutelica12345@cluster1.jpv09z7.mongodb.net/myDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.catch(err => console.error('Error connecting to MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/register', userController.register);
app.post('/api/login', userController.login);

app.post('/api/profile', async (req, res) => {
  const { userEmail, location, interests, availability } = req.body;

  try {
    let profile = await Profile.findOne({ userEmail });

    if (!profile) {
      profile = new Profile({ userEmail, location, interests, availability });
      await profile.save();
      res.status(201).json({ message: 'Profile created successfully', data: profile });
    } else {
      profile.location = location;
      profile.interests = interests;
      profile.availability = availability;
      await profile.save();
      res.status(200).json({ message: 'Profile updated successfully', data: profile });
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

app.get('/api/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).send('User not found');
    const profile = await Profile.findOne({ userEmail: req.params.email });
    if (!profile) return res.status(404).send('Profile not found for this user');
    res.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { userEmail, name } = req.body;
  try {
    const task = new Task({ userEmail, name });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Error creating task' });
  }
});

app.post('/api/search-users', async (req, res) => {
  try {
    const users = await Profile.find({
      location: { $regex: new RegExp(req.body.location, 'i') },
      interests: { $regex: new RegExp(req.body.interests, 'i') },
      availability: { $regex: new RegExp(req.body.availability, 'i') }
    }, 'userEmail');

    console.log("Users found:", users);
    res.json(users);
  } catch (error) {
    console.error('Error searching for users:', error);
    res.status(500).json({ error: 'Error searching for users' });
  }
});

app.get('/api/friend-requests/:email', async (req, res) => {
  try {
    const recipientEmail = req.params.email;
    const friendRequests = await FriendRequest.find({
      recipient: recipientEmail,
      status: 'pending'
    }).populate('requester', 'email');
    res.json(friendRequests);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ error: 'Failed to fetch friend requests' });
  }
});

app.get('/api/friends/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const friendRequests = await FriendRequest.find({
      $or: [
        { requester: email, status: 'accepted' },
        { recipient: email, status: 'accepted' }
      ]
    }).populate('requester recipient', 'email');

    const friends = friendRequests.map(req => {
      return req.requester === email ? req.recipient : req.requester;
    });

    res.json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

app.post('/api/friend-request/send', async (req, res) => {
  const { requesterEmail, recipientEmail } = req.body;

  try {
    const newRequest = new FriendRequest({
      requester: requesterEmail,
      recipient: recipientEmail,
      status: 'pending'
    });
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

app.post('/api/friend-request/accept', async (req, res) => {
  const { requesterEmail, recipientEmail } = req.body;
  try {
    const request = await FriendRequest.findOneAndUpdate(
      { requester: requesterEmail, recipient: recipientEmail, status: 'pending' },
      { status: 'accepted' },
      { new: true }
    );
    if (!request) {
      return res.status(404).send('Request not found');
    }
    res.status(200).json(request);
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
});

app.post('/api/friend-request/decline', async (req, res) => {
  const { requesterEmail, recipientEmail } = req.body;
  try {
    const request = await FriendRequest.findOneAndUpdate(
      { requester: requesterEmail, recipient: recipientEmail, status: 'pending' },
      { status: 'declined' },
      { new: true }
    );
    if (!request) {
      return res.status(404).send('Request not found');
    }
    res.status(200).json(request);
  } catch (error) {
    console.error('Error declining friend request:', error);
    res.status(500).json({ error: 'Failed to decline friend request' });
  }
});

app.get('/api/tasks/:userEmail', async (req, res) => {
  try {
    const tasks = await Task.find({ userEmail: req.params.userEmail, completed: false });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { completed } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { completed }, { new: true });
    if (!task) return res.status(404).send('Task not found');
    res.json(task);
  } catch (error) {
    res.status(500).send('Error updating task: ' + error);
  }
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: corsOptions
});

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('register', (email) => {
    userSocketMap.set(email, socket.id);
    console.log(`User registered: ${email} with socket ID ${socket.id}`);
  });

  Message.find().sort({ createdAt: -1 }).limit(50)
    .then(messages => {
      socket.emit('allMessages', messages);
    })
    .catch(err => console.error('Error fetching messages:', err));

  socket.on('message', (data) => {
    const targetUserSocketId = findUserSocketIdByEmail(data.recipientEmail);
    if (targetUserSocketId) {
      io.to(targetUserSocketId).emit('message', {
        text: data.text,
        user: { email: data.userEmail }
      });
      console.log(`Message sent to ${data.recipientEmail}: ${data.text}`);
    } else {
      console.log(`Recipient ${data.recipientEmail} not connected.`);
    }
  });

  socket.on('disconnect', () => {
    for (let [email, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(email);
        console.log(`User disconnected: ${email}`);
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
