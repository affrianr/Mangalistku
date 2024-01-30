const TwitterStrategy = require('passport-twitter').Strategy;
const { User } = require('../models')
const passport = require('passport')

console.log(process.env.CLIENT_ID_TWITTER)
console.log(process.env.CLIENT_SECRET_TWITTER)

passport.use(new TwitterStrategy(
    {
    consumerKey: process.env.CLIENT_ID_TWITTER,
    consumerSecret: process.env.CLIENT_SECRET_TWITTER,
    callbackURL: "/auth/twitter/callback",
  },
  function(token, tokenSecret, profile, done) {
    done(null, profile)
  }
   
));

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})