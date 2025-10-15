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
        // Get user details from Firebase
        const user = await auth.getUser(userId);
        res.status(HTTP_STATUS.OK).json({
            message: `User details for user ID: ${userId}`,
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
            }
        });
    } catch (error) {
        next(error);
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