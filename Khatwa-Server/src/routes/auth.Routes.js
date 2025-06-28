import { Router } from "express";
import { registerSchema } from "../validation/register.Schema.js";
import { loginSchema } from "../validation/login.Schema.js";
import { validateBody } from "../middleware/validateBody.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import passport from "passport";
import {
  googleAuth,
  googleCallBack,
  refreshToken,
  getCurrentLogInInfo,
  logout,
  Login,
  Register,
} from "../controllers/auth.controller.js";

const authRouter = Router();

// Auth
authRouter.post("/register", validateBody(registerSchema), Register);
authRouter.post("/login", validateBody(loginSchema), Login);
authRouter.post("/refresh-token", refreshToken);

// Current user info & logout

authRouter.get("/me", authenticateJWT, getCurrentLogInInfo);
authRouter.post("/logout", authenticateJWT, logout);

// Google OAuth
authRouter.get("/google", googleAuth);
// In your auth routes
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: true,
  }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/oauth-redirect`);
  }
);
export default authRouter;
