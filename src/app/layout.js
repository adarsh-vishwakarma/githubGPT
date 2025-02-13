"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/Providers";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header
              onMenuClick={() => setSidebarOpen(!sidebarOpen)}
              totalEarnings={totalEarnings}
            />
            <div className="flex flex-1">
              <Sidebar open={sidebarOpen} />
              <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </Providers>
        
      </body>
    </html>
  );
}
