"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
// import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createProject } from "../../actions/dbActions";
type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  // const { register, handleSubmit, reset } = useForm<FormInput>();
  const [projectName, setProjectName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [githubToken, setGithubToken] = useState("")

  const handleSubmit = async (e:any) => {
    e.preventDefault();
  
    const result = await createProject({projectName, repoUrl, githubToken: githubToken || null});
   toast(result.message);

    return true;
  };
  return (
    <div className="flex items-center gap-12 h-full justify-center">
      <img src="/undraw_developer.svg" className="h-56 w-auto" />
      <div>
        <div>
          <h1 className="font-semibold text-2xl">
            Link your Github Repository
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the URL of your repository to link it to GithubGPT
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit}>
            <Input
              value={projectName} onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name"
              required
            />
            <div className="h-2"></div>
            <Input
              value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)}
              type="url"
              placeholder="Github URL"
              required
            />
            <div className="h-2"></div>
            <Input
             value={githubToken} onChange={(e) => setGithubToken(e.target.value)}
              placeholder="Github Token (Optional)"
            />
            <div className="h-2"></div>
            <Button type="submit">Create Project</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
