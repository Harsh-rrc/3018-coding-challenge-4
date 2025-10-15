import express, { Router } from "express";

import { getUserProfile, deleteUser, getUserById } from "../controllers/userController";

import { authenticate } from "../middleware/authenticate";

import { authorize } from "../middleware/authorize";
 
const router: Router = express.Router();
 
/** Route to get the user's profile - requires authentication */

router.get("/profile", authenticate, getUserProfile);
 
/** Route to get user by ID - requires authentication and admin role or same user */

router.get("/:id", authenticate, authorize(["admin"], true), getUserById);
 
/** Route to delete a user - requires authentication and admin role */

router.delete("/:id", authenticate, authorize(["admin"]), deleteUser);
 
export default router;