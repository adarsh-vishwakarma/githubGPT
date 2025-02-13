import RecentReport from "@/components/RecentReport";
import UploadWasteReport from "@/components/UploadWasteReport";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const ReportWaste = async () => {
  const session = await getServerSession()
console.log(session)
  if(!session) return redirect("/")

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Report waste
      </h1>
      <UploadWasteReport />
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        Recent Reports
      </h2>
      <RecentReport />
    </div>
  );
};

export default ReportWaste;
