const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// configure body-parser to parse JSON data
app.use(bodyParser.json());

// enable cross-origin resource sharing
app.use(cors());
app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
// connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/shop', { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// define User schema and model
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String
});

const User = mongoose.model('User', userSchema);

// register user API
app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save()
        .then(savedUser => {
            res.status(201).send(savedUser);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});

// get user by ID API
app.get('/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).send('User not found');
            } else {
                res.status(200).send(user);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});





// update user API
app.patch('/users/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!user) {
        res.status(404).send('User not found');
      } else {
        res.status(200).send(user);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  });

// delete/disable user API
app.delete('/users/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).send('User not found');
            } else {
                res.status(200).send(user);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});