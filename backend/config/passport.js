require('dotenv').config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// 🔥 GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails.length > 0 
          ? profile.emails[0].value 
          : `${profile.id}@google.com`;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            firstName: (profile.name && profile.name.givenName) || profile.displayName || "Google",
            lastName: (profile.name && profile.name.familyName) || "User",
            email,
            password: "googleAuth123",
          });
        }

        const token = generateToken(user._id);

        done(null, { user, token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// 🔥 GITHUB
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails.length > 0
          ? profile.emails[0].value
          : (profile._json && profile._json.email) || `${profile.username || profile.id}@github.com`;

        let user = await User.findOne({ email });

        if (!user) {
          const nameParts = (profile.displayName || profile.username || "GitHub User").split(" ");
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(" ") || "User";

          user = await User.create({
            firstName,
            lastName,
            email,
            password: "githubAuth123",
          });
        }

        const token = generateToken(user._id);

        done(null, { user, token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;