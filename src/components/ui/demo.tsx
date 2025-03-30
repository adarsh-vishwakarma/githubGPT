// import { getUserProjects } from "@/app/actions/dbActions";
// import { useLocalStorage } from "usehooks-ts";

// const UseProject = async () => {
//   const projects:any = await getUserProjects(); 
//   const [projectId, setProjectId] = useLocalStorage("GithubGPT-projectId", " ");
//   const project = projects?.find((project:any) => project.id === projectId);
//   return {
//     projects,
//     project,
//     projectId,
//     setProjectId,
//   };
// };

// export default UseProject;

import { useState, useEffect } from "react";
import { getUserProjects } from "@/app/actions/dbActions";
import { useLocalStorage } from "usehooks-ts";

// Define the project type
type Project = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  githubURL: string;
  deletedAt: Date | null;
};

// Define the possible API response type
type ProjectResponse = Project[] | { success: boolean; message: string };

const UseProject = () => {
  const [projects, setProjects] = useState<Project[]>([]); // ✅ Explicit type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useLocalStorage<string>("GithubGPT-projectId", " ");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true); // Start loading

        const fetchedProjects: ProjectResponse = await getUserProjects(); // Fetch projects

        if (Array.isArray(fetchedProjects)) {
           
          setProjects(fetchedProjects); // ✅ Set only if it's an array
        } else {
          setError(fetchedProjects.message); // Handle API error message
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProjects();
  }, []);


  const project = projects.find((p) => p.id === projectId) || null;

  return {
    projects,
    project,
    projectId,
    setProjectId,
    loading,
    error,
  };
};

export default UseProject;
