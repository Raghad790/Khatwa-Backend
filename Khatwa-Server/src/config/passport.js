import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  createUser,
  getUserById,
  getUserByEmail,
  getUserbyGoogleId,
} from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

// Validate environment variables
if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.GOOGLE_CALLBACK_URL
) {
  throw new Error("Google OAuth credentials not configured properly");
}

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      // ✅ FIX: Removed passReqToCallback since it's not used
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(`🟢 Google auth attempt: ${profile.displayName}`);

        const email = profile.emails?.[0]?.value;
        if (!email) throw new Error("No email found in Google profile");

        // 🔍 Look up by Google ID
        let user = await getUserbyGoogleId(profile.id);

        // If not found, try by email
        if (!user) {
          user = await getUserByEmail(email);
        }

        if (user) {
          console.log("✅ Existing user found:", user.email);
          console.log("✅ About to serialize user:", user);
          return done(null, user);
        }

        // 🚀 Create a new user if not found
        const newUser = await createUser({
          name: profile.displayName,
          email,
          avatar: profile.photos?.[0]?.value || null,
          oauth_provider: "google",
          oauth_id: profile.id,
          role: "student", // default role
          password: null,
          isVerified: true,
        });

        console.log("🆕 New user created:", newUser.email);
        return done(null, newUser);
      } catch (err) {
        console.error("❌ GoogleStrategy error:", err.message);
        return done(err, null);
      }
    }
  )
);

// ✅ Session serialization
passport.serializeUser((user, done) => {
  try {
    if (!user || !user.id) {
      console.error("❌ Failed to serialize: User or user.id is missing", user);
      return done(new Error("User object is missing or invalid"), null);
    }
    done(null, user.id);
  } catch (err) {
    console.error("❌ Serialization error:", err);
    done(err, null);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    if (!user) throw new Error("User not found");
    done(null, user);
  } catch (err) {
    console.error("❌ Deserialization error:", err.message);
    done(err, null);
  }
});

export default passport;
