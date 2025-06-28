// routes/upload.routes.js
import { Router } from "express";
import {
  upload,
  uploadFile,
  getFileById,
  deleteFile,
  uploadLessonFile,
  getLessonFiles,
} from "../controllers/upload.controller.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import {
  requireRole,
  requireInstructorOrAdmin,
  requireOwnershipOrAdmin,
} from "../middleware/authorize.js";

const router = Router();

// Require authentication for all upload routes
router.use(authenticateJWT);

// File upload routes - specific routes first
router.post(
  "/",
  requireRole(["student", "instructor", "admin"]), // Allow all authenticated users
  upload.single("file"),
  uploadFile
);

// Lesson file routes - specific routes before parameterized routes
router.post(
  "/lesson/file",
  requireInstructorOrAdmin, // Only instructors and admins
  upload.single("file"),
  uploadLessonFile
);

router.get(
  "/lesson/:lessonId/files",
  async (req, res, next) => {
    // Anyone who can access the lesson can see its files
    // This is typically handled within the controller based on enrollment
    next();
  },
  getLessonFiles
);

// Individual file operations - parameterized routes last
// Get file by ID - check access in controller based on file association
router.get("/:id", getFileById);

// Delete file - require ownership or admin
router.delete(
  "/:id",
  requireOwnershipOrAdmin(async (req) => {
    // Logic to determine file owner ID
    // Example implementation:
    try {
      const fileId = req.params.id;
      // This is a placeholder - you need to implement this in your model
      const file = await YourFileModel.getFileById(fileId);
      return file ? file.uploaded_by : null;
    } catch (error) {
      console.error("Error checking file ownership:", error);
      throw error;
    }
  }),
  deleteFile
);

export default router;
