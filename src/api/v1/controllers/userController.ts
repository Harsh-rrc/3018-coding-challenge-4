import { Request, Response, NextFunction } from "express";
import { auth } from "../../../config/firebaseConfig";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Controller to get the user profile.
 * Requires authentication middleware to set res.locals.uid
 */
export const getUserProfile = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const userId: string = res.locals.uid;
        const userRole: string = res.locals.role;

        if (!userId) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                error: "User not authenticated",
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: `User profile for user ID: ${userId}`,
            userId: userId,
            role: userRole
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to get user by ID
 */
export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId: string = req.params.id;
        const currentUserId: string = res.locals.uid;
        const currentUserRole: string = res.locals.role;
        
        console.log(`Fetching user ${userId} by user ${currentUserId} with role ${currentUserRole}`);
        
        // Get user details from Firebase
        const user = await auth.getUser(userId);
        
        // Prepare response data - include more details for admin, basic for same user
        let userData: any = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
        };
        
        // Add additional fields for admin users
        if (currentUserRole === 'admin') {
            userData.customClaims = user.customClaims;
            userData.emailVerified = user.emailVerified;
            userData.disabled = user.disabled;
        }
        
        res.status(HTTP_STATUS.OK).json({
            message: `User details retrieved successfully`,
            user: userData,
            requestedBy: currentUserId
        });
    } catch (error: any) {
        console.error("Error getting user by ID:", error);
        
        if (error.code === 'auth/user-not-found') {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                error: "User not found",
            });
        } else {
            next(error);
        }
    }
};

/**
 * Controller to delete a user (requires admin role).
 */
export const deleteUser = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const userId: string = req.params.id;
        const currentUserId: string = res.locals.uid;
        const currentUserRole: string = res.locals.role;

        if (!currentUserRole) {
            res.status(HTTP_STATUS.FORBIDDEN).json({
                error: "User role not found",
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: `User ${userId} deleted by admin`,
            deletedBy: currentUserId,
            role: currentUserRole
        });
    } catch (error) {
        next(error);
    }
};