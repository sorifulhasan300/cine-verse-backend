import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../app/lib/auth";
import { UserRole } from "../types/role.types";

export const checkAuth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const hasToken = req.headers.cookie || req.headers.authorization;
    if (!hasToken) {
      return res.status(401).json({ message: "you are not authenticate for access this route" });
    }
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      return res.status(401).json({ message: "you are not authenticate for access this route" });
    }
    req.user = {
      id: session.user.id,
      name: session.user.email,
      email: session.user.email,
      role: session.user.role,
      emailVerified: session.user.emailVerified,
    };
    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({ message: "Forbidden access" });
    }
    next();
  };
};
