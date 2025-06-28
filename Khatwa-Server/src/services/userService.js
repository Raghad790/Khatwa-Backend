import { getUserbyGoogleId, createUser } from "../models/user.model.js";

/**
 * Finds a user by Google OAuth ID or email, or creates a new user if not found.
 * Returns the user object for Passport.js.
 */
export async function findOrCreateOAuthUser({
  oauth_id,
  email,
  name,
  avatar,
  provider,
}) {
  if (!oauth_id || !email) {
    throw new Error("Missing required OAuth user info");
  }

  // Try to find user by Google ID
  let user = await getUserbyGoogleId(oauth_id);
  if (user) return user;

  // Optionally: check if a user exists with this email (merge accounts)
  // ...

  // Create new user
  const newUser = await createUser({
    name,
    email,
    avatar,
    oauth_provider: provider,
    oauth_id,
    role: "student",
    password: null,
    isVerified: true,
  });
  return newUser;
}
