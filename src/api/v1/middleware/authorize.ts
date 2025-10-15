import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Authorization middleware for role-based access control
 * @param allowedRoles Array of roles that are allowed to access the route
 * @param allowSameUser Optional boolean to allow users to access their own resources
 */
export const authorize = (allowedRoles: string[], allowSameUser: boolean = false) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const userRole = res.locals.role;
            const userId = res.locals.uid;
            const resourceId = req.params.id; // Assuming the resource ID is in req.params.id

            console.log(`Authorization check - User: ${userId}, Role: ${userRole}, Resource: ${resourceId}`);

            // Check if user has one of the allowed roles
            if (allowedRoles.includes(userRole)) {
                console.log(`Access granted: User has required role (${userRole})`);
                next();
                return;
            }

            // Check if same user access is allowed and user is accessing their own resource
            if (allowSameUser && resourceId && userId === resourceId) {
                console.log(`Access granted: User is accessing their own resource`);
                next();
                return;
            }

            // If neither condition is met, deny access
            console.log(`Access denied: User ${userId} with role ${userRole} not authorized`);
            res.status(HTTP_STATUS.FORBIDDEN).json({
                error: "Insufficient permissions",
                requiredRoles: allowedRoles,
                userRole: userRole
            });

        } catch (error) {
            console.error("Authorization error:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                error: "Authorization check failed",
            });
        }
    };
};