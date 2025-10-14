import express, { Router } from "express";
import { getUserProfile, deleteUser } from "../controllers/userController";

const router: Router = express.Router();

/** Route to get the user's profile - requires authentication */
router.get("/profile", getUserProfile);

/** Route to delete a user - requires authentication and admin role */
router.delete("/:id", deleteUser);

export default router;