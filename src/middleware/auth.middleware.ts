import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../app/lib/auth";
import { UserRole } from "../types/role.types";

export const checkAuth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.cookie;
    if (!token) {
      return res.send("you are not authenticate");
    }
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    req.user = {
      id: session?.user.id,
      name: session?.user.email,
      email: session?.user.email,
      role: session?.user.role,
      emailVerified: session?.user.emailVerified,
    };
    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return res.send("Forbidden access");
    }
    next();
  };
};
