import Searchbox from '@/components/Searchbox'
import { NEXT_AUTH } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

import React from 'react'

const CollectWaste = async () => {
    const session = await getServerSession(NEXT_AUTH)
    if(!session) return <div>Loading...</div>
    const fetchedUser = await prisma.users.findUnique({
                where: {
                    email: session?.user.email
                }
              })
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
         <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Waste Collection Tasks
      </h1>
      <Searchbox session={session} fetchedUser={fetchedUser}/>
    </div>
  )
}

export default CollectWaste