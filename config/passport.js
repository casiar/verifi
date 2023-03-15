const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Save or find the user in the database
    }
  )
);

// Facebook OAuth strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Save or find the user in the database
    }
    )
);

// Twitter OAuth strategy
passport.use(
    new TwitterStrategy(
    {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: '/auth/twitter/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
    // Save or find the user in the database
    }
    )
);

// Function to save or find the user in the database
async function saveOrUpdateUser(profile, provider, done) {
    try {
    const user = await User.findOne({ oauthId: profile.id });
    if (user) {
        done(null, user);
      } else {
        const newUser = new User({
          oauthId: profile.id,
          displayName: profile.displayName,
          provider: provider,
          avatar: profile.photos[0].value,
        });
      
        await newUser.save();
        done(null, newUser);
      }
    } catch (err) {
        console.error(err);
        done(err, null);
        }
        }      