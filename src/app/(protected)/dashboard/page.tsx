"use client"
import UseProject from '@/hooks/use-project';
import React from 'react'

const DashboardPage = () => {
  const { projects, project, projectId, isLoading, error } = UseProject();
  console.log("project")


  return (
    // <div>{project?.name}</div>
    <div>Hii</div>
  )
}

export default DashboardPage