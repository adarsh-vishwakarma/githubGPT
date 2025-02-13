"use server";


import { NEXT_AUTH } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient()
export async function registerUser(user) {
  const { email, password, name } = user; // Parse the incoming data

  if (!email || !password) {
    return { message: "Email and password are required", status: 400 };
  }

  try {
    console.log(email)
    // Check if the user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });
    console.log("HII------------------")

    if (existingUser) {
      return { message: "User already exists", status: 400 };
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
console.log(hashedPassword)
    // Create the user in the database
    const newUser = await prisma.users.create({
      data: {
        email,
        name: name || null,
        passowrd: hashedPassword,
      },
    });
console.log("Hii")
    // Return the user without the password
    const { password: _, ...userWithoutPassword } = newUser;

    return { user: userWithoutPassword, status: 201 };
  } catch (error) {
    console.log("Signup error:", error);
    return { message: "Internal server error", status: 500 };
  }
}


export async function isLoggedIn() {
  const session = await getServerSession(NEXT_AUTH);
  return session;
}