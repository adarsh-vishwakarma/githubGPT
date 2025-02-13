"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(email, name) {
  try {
    const user = await prisma.users.create({
      data: { email, name },
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}


export async function getUnreadNotifications(userId) {
  try {
    // Fetch unread notifications for the user
    const notifications = await prisma.notifications.findMany({
      where: {
        userId: userId,
        isRead: false,  // Only unread notifications
      },
    });

    // console.log("Unread notifications:", notifications);
    return notifications;  // Return the list of unread notifications
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    return [];  // Return an empty array in case of an error
  }
}

export async function getUserByEmail(email) {
  try {

    const user = await prisma.users.findUnique({
      where: { email },
    });
  
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

// Report Functions
export async function createReport(
  id,
  location,
  wasteType,
  amount,
  imageUrl = null,
  verificationResult = null
) {
  try {
    const userId = parseInt(id, 10); // Parse string to integer

    //  console.log(typeof(userId))
    const report = await prisma.reports.create({
      data: {
        userId: userId,
        location: location,
        wasteType: wasteType,
        amount: amount,
        imageUrl: imageUrl || undefined, // Use undefined instead of null for Prisma
        verificationResult: verificationResult || {},
        status: "pending",
      },
    });

    // console.log("Hiii");
    // Award 10 points for reporting waste
    const pointsEarned = 10;
    await updateRewardPoints(userId, pointsEarned);

    // Create a transaction for the earned points
    await createTransaction(
      userId,
      "earned_report",
      pointsEarned,
      "Points earned for reporting waste"
    );

    // Create a notification for the user
    await createNotification(
      userId,
      `You've earned ${pointsEarned} points for reporting waste!`,
      "reward"
    );

    return report;
  } catch (error) {
    console.error("Error creating report:", error);
    return null;
  }
}

export async function getReportsByUserId(userId) {
  try {
    const reports = await prisma.reports.findMany({
      where: { userId },
    });
    return reports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}


export async function getAllRewards() {
  try {
    const rewards = await prisma.rewards.findMany({
      include: {
        user: {
          select: {
            name: true, // Fetch the user's name
          },
        },
      },
      orderBy: {
        points: 'desc', // Order by points in descending order
      },
    });

    // Mapping rewards to include userName in the results
    const mappedRewards = rewards.map(reward => ({
      ...reward,
      userName: reward.user.name, // Add userName to each reward
    }));

    return mappedRewards;
  } catch (error) {
    console.error("Error fetching all rewards:", error);
    return []; // Return an empty array if an error occurs
  }
}

export async function getWasteCollectionTasks(limit = 20) {
  try {
    const tasks = await prisma.reports.findMany({
      select: {
        id: true,
        location: true,
        wasteType: true,
        amount: true,
        status: true,
        createdAt: true,
        collectorId: true,
      },
      take: limit,
    });
// console.log(tasks)
    // Map over the tasks to format the date as YYYY-MM-DD
    
    return tasks.map(task => ({
      ...task,
      date: task.createdAt.toISOString().split('T')[0], // Format date as YYYY-MM-DD
    }));
  } catch (error) {
    console.error("Error fetching waste collection tasks:", error);
    return [];
  }
}




// Reward Functions
export async function getOrCreateReward(userId) {
  try {
    let reward = await prisma.rewards.findUnique({
      where: { userId },
    });

    if (!reward) {
      reward = await prisma.rewards.create({
        data: {
          userId,
          name: "Default Reward",
          points: 0,
          level: 1,
        },
      });
    }

    return reward;
  } catch (error) {
    console.error("Error getting or creating reward:", error);
    return null;
  }
}

export async function updateRewardPoints(userId, pointsToAdd) {
  try {

    const existingReward = await prisma.rewards.findFirst({
      where: { userId },
    });
    // console.log(existingReward)
// console.log(pointsToAdd, userId, typeof(userId), typeof(pointsToAdd))
    if (existingReward) {
      // If the reward record exists, increment the points
      const updatedReward = await prisma.rewards.updateMany({
        where: { userId },
        data: {
          points: {
            increment: pointsToAdd,  // Add points to the existing points
          },
          updatedAt: new Date(),  // Update the timestamp
        },
      });
      // console.log(updatedReward)
      return updatedReward;

    } else {
      // If no reward record exists, create a new one
      const newReward = await prisma.rewards.create({
        data: {
          userId,
          points: pointsToAdd, // Set the initial points to the pointsToAdd value
          level: 1,  // Set the initial level (you can adjust this logic)
          updatedAt: new Date(), // Set the updatedAt field
          createdAt: new Date(), // Set the createdAt field
          isAvailable: true, // Set availability based on your needs
          name: "New User Reward",  // Set a default or dynamic name
          collectionInfo: "Initial reward for reporting waste",  // Set a default or dynamic collection info
        },
      });
      // console.log("Success")
      return newReward;
    }
  } catch (error) {
    console.error("Error updating or creating reward points:", error);
    return null;
  }
}


// Collected Waste Functions
export async function createCollectedWaste(reportId, collectorId) {
  try {
    const collectedWaste = await prisma.collectedWastes.create({
      data: {
        reportId,
        collectorId,
        collectionDate: new Date(),
        status: "verified",
      },
    });
    return collectedWaste;
  } catch (error) {
    console.error("Error creating collected waste:", error);
    return null;
  }
}

// Notification Functions
export async function createNotification(userId, message, type) {
  try {
    const notification = await prisma.notifications.create({
      data: {
        userId,
        message,
        type,
      },
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
}

// Transaction Functions
export async function createTransaction(userId, type, amount, description) {
  try {
    const transaction = await prisma.transactions.create({
      data: {
        userId,
        type,
        amount,
        description,
      },
    });
    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

// Reward Redemption Functions
export async function redeemReward(userId, rewardId) {
  try {
    const userReward = await getOrCreateReward(userId);

    if (rewardId === 0) {
      const updatedReward = await prisma.rewards.update({
        where: { userId },
        data: {
          points: 0,
          updatedAt: new Date(),
        },
      });

      await createTransaction(
        userId,
        "redeemed",
        userReward.points,
        `Redeemed all points: ${userReward.points}`
      );

      return updatedReward;
    } else {
      const availableReward = await prisma.rewards.findUnique({
        where: { id: rewardId },
      });

      if (!availableReward || userReward.points < availableReward.points) {
        throw new Error("Insufficient points or invalid reward");
      }

      const updatedReward = await prisma.rewards.update({
        where: { userId },
        data: {
          points: { decrement: availableReward.points },
          updatedAt: new Date(),
        },
      });

      await createTransaction(
        userId,
        "redeemed",
        availableReward.points,
        `Redeemed: ${availableReward.name}`
      );

      return updatedReward;
    }
  } catch (error) {
    console.error("Error redeeming reward:", error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    // Using Prisma to update the notification's 'isRead' status

    await prisma.notifications.update({
      where: {
        id: notificationId, // Finding the notification by its ID
      },
      data: {
        isRead: true, // Setting 'isRead' to true
      },
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}

export async function getRecentReports(limit = 10) {
  try {
    const reports = await prisma.reports.findMany({
      take: limit, // Limit the number of reports to the specified limit
      orderBy: {
        createdAt: "desc", // Order by the createdAt field in descending order
      },
    });

    // Format the createdAt field to 'YYYY-MM-DD'
    const formattedReports = reports.map((report) => ({
      ...report,
      createdAt: report.createdAt.toISOString().split("T")[0], // Format to 'YYYY-MM-DD'
    }));

    return formattedReports;
  } catch (error) {
    console.error("Error fetching recent reports:", error);
    return []; // Return an empty array in case of error
  }
}




export async function getRewardTransactions(userId) {
  try {
    // console.log("Fetching transactions for user ID:", userId);

    const transactions = await prisma.transactions.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        date: 'desc', // Order by date in descending order
      },
      take: 10, // Limit to the last 10 transactions
    });

    // console.log("Raw transactions from database:", transactions);

    const formattedTransactions = transactions.map((t) => ({
      ...t,
      date: t.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
    }));

    // console.log("Formatted transactions:", formattedTransactions);
    return formattedTransactions;
  } catch (error) {
    console.error("Error fetching reward transactions:", error);
    return [];
  }
}


export async function getUserBalance(userId) {
  try {
    const transactions = await getRewardTransactions(userId);

    // Calculate balance based on transactions
    const balance = transactions.reduce((acc, transaction) => {
      // Add the amount for 'earned' transactions, subtract for others
      return transaction.type.startsWith('earned') 
        ? acc + transaction.amount 
        : acc - transaction.amount;
    }, 0);

    // Return balance ensuring it's not negative
    return Math.max(balance, 0);
  } catch (error) {
    console.error("Error calculating user balance:", error);
    return 0; // Default to 0 balance in case of error
  }
}



export async function updateTaskStatus(reportId, newStatus, collectorId) {
  // console.log(typeof(reportId))
  // return
  try {
    const updateData = { status: newStatus };
    if (collectorId !== undefined) {
      updateData.collectorId = collectorId;
    }
   const newCollectorId = parseInt(updateData.collectorId, 10)
    // console.log(typeof(updateData.collectorId))
    // return
    const updatedReport = await prisma.reports.update({
      where: { id: reportId },
      data: {
        status: updateData.status,
        collectorId: newCollectorId
      }
    });
    // console.log(updatedReport)
    // return 
    console.log("Complete")
    return updatedReport;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
}