const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const Users = require('./data/users-model');

const server = express();

const sessionConfig = {
  name: 'sessionId',
  secret: process.env.SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: false,
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: require('./data/db-config'),
    tablename: 'sessions',
    sidfieldname: 'SessionId',
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

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

let authed = false; // Massively imperfect solution, I know! :P
server.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        authed = true;
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get('/api/users', (req, res) => {
  if (authed) {
    Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
  } else {
    res.status(401).json({
      message: 'Unauthorised credentials.'
    });
  }
});

module.exports = server;