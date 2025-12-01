import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Administrator from "@/models/Administrator";
import type { IUser, IAdministrator, UserRole } from "@/types";

const envSecret = process.env.JWT_SECRET;
if (!envSecret) throw new Error("JWT_SECRET is not set");
const JWT_SECRET: jwt.Secret = envSecret;

export type JwtPayload = { userId: string; role: UserRole; isAdmin?: boolean };

export function signToken(payload: JwtPayload, expiresIn: string = "7d") {
  const options: jwt.SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export async function getAuthUserFromToken(token: string) {
  try {
    const payload = verifyToken(token);
    await connectDB();

    if (payload.isAdmin) {
      const admin = await Administrator.findById(payload.userId).lean<IAdministrator>();
      if (!admin) return null;
      return { _id: String(admin._id), role: "admin" as UserRole };
    }

    const user = await User.findById(payload.userId).lean<IUser>();
    if (!user) return null;
    return { _id: String(user._id), role: user.role } as { _id: string; role: UserRole };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getAuthUser(req: NextRequest) {
  // First try Authorization header
  const header = req.headers.get("authorization");
  if (header) {
    const [, token] = header.split(" ");
    if (token) {
      const user = await getAuthUserFromToken(token);
      if (user) return user;
    }
  }
  
  // Fallback to cookie (for admin dashboard and server-side requests)
  try {
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get("token")?.value;
    if (tokenFromCookie) {
      return getAuthUserFromToken(tokenFromCookie);
    }
  } catch (error) {
    // cookies() might not be available in all contexts, ignore error
  }
  
  return null;
}

export async function requireAuth(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdmin(req: NextRequest) {
  const user = await requireAuth(req);
  // Check if user is admin (either from User collection with role="admin" or from Administrator collection)
  if (user.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}

