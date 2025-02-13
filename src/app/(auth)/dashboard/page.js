"use client"

import { isLoggedIn } from "@/actions/authActions";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {

  const [user, setUser] = useState();

useEffect(async ()=>{
const user = await isLoggedIn();
setUser(user)
console.log(user)
},[])
  return (
    <>
      
      <div>
      {JSON.stringify(user)}
     
    </div>
    </>
    
  );
}