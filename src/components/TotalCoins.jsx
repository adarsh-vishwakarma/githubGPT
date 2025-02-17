"use client"
import { Coins } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const TotalCoins = ({fetchedTransactions}) => {
  console.log(fetchedTransactions)
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    if (fetchedTransactions) {
      const calculatedBalance = fetchedTransactions.reduce((acc, transaction) => {
        return transaction.type.startsWith("earned") ? acc + transaction.amount : acc - transaction.amount;
      }, 0);
console.log(calculatedBalance)
      setBalance(Math.max(calculatedBalance, 0));
    }
  }, [fetchedTransactions]);

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between h-full border-l-4 border-green-500 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Reward Balance</h2>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center">
            <Coins className="w-10 h-10 mr-3 text-green-500" />
            <div>
              <span className="text-4xl font-bold text-green-500">{balance}</span>
              <p className="text-sm text-gray-500">Available Points</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TotalCoins