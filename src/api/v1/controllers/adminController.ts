import { Request, Response, NextFunction } from "express";

import { UserRecord } from "firebase-admin/auth";

import { auth } from "../../../config/firebaseConfig";

import { HTTP_STATUS } from "../../../constants/httpConstants";

/**

* Controller to set custom claims for a user (e.g., roles)

*/

export const setCustomClaims = async (

    req: Request,

    res: Response,

    next: NextFunction

): Promise<void> => {

    try {

        const { uid, claims } = req.body;

        // Validate request body

        if (!uid || !claims) {

            res.status(HTTP_STATUS.BAD_REQUEST).json({

                error: "Missing required fields: uid and claims",

            });

            return;

        }

        await auth.setCustomUserClaims(uid, claims);

        res.status(HTTP_STATUS.OK).json({

            message: `Custom claims set for user: ${uid}`,

            success: true,

            uid,

            claims

        });

    } catch (error: unknown) {

        console.error("Error setting custom claims:", error);

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

    try {

        const { uid } = req.params;

        if (!uid) {

            res.status(HTTP_STATUS.BAD_REQUEST).json({

                error: "User ID is required",

            });

            return;

        }

        const user: UserRecord = await auth.getUser(uid);

        res.status(HTTP_STATUS.OK).json({

            success: true,

            data: {

                uid: user.uid,

                email: user.email,

                displayName: user.displayName,

                customClaims: user.customClaims

            },

        });

    } catch (error: unknown) {

        console.error("Error getting user details:", error);

        next(error);

    }

};