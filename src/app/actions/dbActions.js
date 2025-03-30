"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function authMiddleware() {
  const { userId } = await auth();
  return userId;
}

export async function createProject(data) {
  try {
    const { projectName, repoUrl, githubToken } = data;

    if (!projectName || !repoUrl) {
      return { success: false, message: "Project name and repository URL are required." };
    }

    const userId = await authMiddleware();
    if (!userId) {
      return { success: false, message: "Unauthorized: You must be logged in." };
    }

    const project = await prisma.project.create({
      data: {
        githubURL: repoUrl,
        name: projectName, 
        UserToProject: {
          create: {
            userId: userId
          }
        }
      }
    });

    return { success: true, message: "Project created successfully.", project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, message: "An error occurred while creating the project.", error: error.message };
  }
}



export async function getUserProjects() {
  const userId = await authMiddleware();
    if (!userId) {
      return { success: false, message: "Unauthorized: You must be logged in." };
    }
  const projects = await prisma.project.findMany({
    where: {
      UserToProject: {
        some: {
          userId
        },
      },
      deletedAt: null,
    },
  });
  return projects
}