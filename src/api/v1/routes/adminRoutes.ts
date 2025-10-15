import express, { Router } from "express";

import { setCustomClaims, getUserDetails } from "../controllers/adminController";

import { authenticate } from "../middleware/authenticate";

import { authorize } from "../middleware/authorize";
 
const router: Router = express.Router();
 
/** Route to set custom claims for a user - requires admin role */

router.post("/setCustomClaims", authenticate, authorize(["admin"]), setCustomClaims);
 
/** Route to get user details from Firebase - requires admin role */

router.get("/users/:uid", authenticate, authorize(["admin"]), getUserDetails);
 
export default router;