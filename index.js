const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const User = require('./models/user');


dotenv.config();

const app = express();

app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error(err));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
    })
  );
  
app.use(passport.initialize());
app.use(passport.session());
  
require('./config/passport');

app.get('/', (req, res) => {
    res.render('index');
});
  
app.get('/profile/:username', (req, res) => {
    res.render('profile', { user: req.user });
});

app.get('/user/exists/:username', async (req, res) => {
    const user = await User.findOne({ displayName: req.params.username });
    res.json(!!user);
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.use(express.urlencoded({ extended: false }));

app.post('/register', async (req, res) => {
  const { username } = req.body;

  try {
    const existingUser = await User.findOne({ displayName: username });

    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const newUser = new User({
      oauthId: `manual_${username}`,
      displayName: username,
      provider: 'manual',
    });

    await newUser.save();
    res.redirect(`/profile/${username}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//Auths
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile');
});
  
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/profile');
});

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter'), (req, res) => {
  res.redirect('/profile');
});
  // Other authentication routes

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});