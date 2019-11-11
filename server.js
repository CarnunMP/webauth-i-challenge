const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');

const Users = require('./data/users-model');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("<h2> We're up and running! <h2>");
});

server.post ('/api/register', (req, res) => {
  const user = req.body;
  const hashedPassword = bcrypt.hashSync(user.password, 11);
  const userToPost = {
    username: user.username,
    password: hashedPassword,
  };

  Users.add(userToPost)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
});

server.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = server;