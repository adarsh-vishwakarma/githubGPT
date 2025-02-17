"use client"
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import React, { useState } from 'react'

const RecentTransaction = ({fetchedTransactions}) => {
    const [transactions, setTransactions] = useState([]);
    console.log(fetchedTransactions)
  return (
    <div>
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recent Transactions</h2>
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {fetchedTransactions.length > 0 ? (
        fetchedTransactions.map(transaction => (
          <div key={transaction.id} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center">
              {transaction.type === 'earned_report' ? (
                <ArrowUpRight className="w-5 h-5 text-green-500 mr-3" />
              ) : transaction.type === 'earned_collect' ? (
                <ArrowUpRight className="w-5 h-5 text-blue-500 mr-3" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-500 mr-3" />
              )}
              <div>
                <p className="font-medium text-gray-800">{transaction.description}</p>
                <p className="text-sm text-gray-500">{JSON.stringify(transaction.date)}</p>
              </div>
            </div>
            <span className={`font-semibold ${transaction.type.startsWith('earned') ? 'text-green-500' : 'text-red-500'}`}>
              {transaction.type.startsWith('earned') ? '+' : '-'}{transaction.amount}
            </span>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">No transactions yet</div>
      )}
    </div>
  </div>
  )
}

export default RecentTransaction