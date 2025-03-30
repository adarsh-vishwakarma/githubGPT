import { useQuery } from "@tanstack/react-query";
import { getUserProjects } from "@/app/actions/dbActions";
import { useLocalStorage } from "usehooks-ts";

// Define the expected Project type
type Project = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  githubURL: string;
  deletedAt: Date | null;
};

// API can return either an array of projects or an error object
type ProjectResponse = Project[] | { success: boolean; message: string };

const useProject = () => {
  const { data, isLoading, error, refetch } = useQuery<ProjectResponse>({
    queryKey: ["projects"],
    queryFn: getUserProjects,
    staleTime: 1000 * 60 * 5, // ✅ Cache data for 5 minutes
    refetchOnWindowFocus: false, // ✅ Prevents auto refetching on tab switch
  });

  // ✅ Ensure `projects` is always an array (if API fails, return an empty array)
  const projects: Project[] = Array.isArray(data) ? data : [];

  const [projectId, setProjectId] = useLocalStorage<string>("GithubGPT-projectId", "");

  const project = projects.find((p) => p.id === projectId) || null;

  return { projects, project, projectId, setProjectId, isLoading, error, refetch };
};

export default useProject;
