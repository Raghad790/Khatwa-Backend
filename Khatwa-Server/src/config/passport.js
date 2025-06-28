import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreateOAuthUser } from "../services/userService.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateOAuthUser({
          oauth_id: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
          provider: "google",
        });
        return done(null, user);
      } catch (err) {
        console.error("GoogleStrategy error:", err);
        return done(err, null); // ✅ 'done' must be passed in this scope
      }
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.id); // store only the user ID in the session
});

// Deserialize user on every request
passport.deserializeUser(async (id, done) => {
  try {
    // Import here to avoid circular dependency at top
    const { getUserById } = await import("../models/user.model.js");
    const user = await getUserById(id); // you must define this in your model
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
