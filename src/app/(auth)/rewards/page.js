
import { getRewardTransactions } from "@/actions/dbActions";
import RecentTransaction from "@/components/RecentTransaction";
import TotalCoins from "@/components/TotalCoins";
import { NEXT_AUTH } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import React from "react";

const RewardPage = async () => {

  const session = await getServerSession(NEXT_AUTH);
  if(!session) return <div>Loading...</div>
  const currUser = await prisma.users.findUnique({
    where: {
      email: session.user.email
    }
  })

  const fetchedTransactions = await prisma.transactions.findMany({
    where: {
      userId: currUser.id
    },
    orderBy: {
      date: 'desc', // Order by date in descending order
    },
    take: 10, // Limit to the last 10 transactions
   select: {
    id:true,
    userId: true,
    amount: true,
    date: true,
    description :true,
    type:true
   }
  });
  
  console.log(fetchedTransactions)

  return (
    <>
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Rewards</h1>
      </div>
      <TotalCoins fetchedTransactions={fetchedTransactions}/>
      <div className="grid md:grid-cols-2 gap-8">
<RecentTransaction fetchedTransactions={fetchedTransactions}/>
      </div>
    </>
  );
};

export default RewardPage;
