import { Request, Response, NextFunction } from "express";
import { UserRecord } from "firebase-admin/auth";
import { auth } from "../../../../config/firebaseConfig";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Controller to set custom claims for a user (e.g., roles)
 */
export const setCustomClaims = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { uid, claims } = req.body;

    try {
        await auth.setCustomUserClaims(uid, claims);
        res.status(HTTP_STATUS.OK).json({
            message: `Custom claims set for user: ${uid}`,
            success: true,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Controller to get user details from Firebase Auth
 */
export const getUserDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { uid } = req.params;

    try {
        const user: UserRecord = await auth.getUser(uid);
        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: user,
        });
    } catch (error: unknown) {
        next(error);
    }
};