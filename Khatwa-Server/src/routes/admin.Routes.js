import { Router } from "express";
import { getUsageReport } from "../controllers/admin.controller.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const adminRouter = Router();

// Usage report endpoint (protected, admin only)
adminRouter.get("/reports/usage", authenticateJWT, getUsageReport);

export default adminRouter;
