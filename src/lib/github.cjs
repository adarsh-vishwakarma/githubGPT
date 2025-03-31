import { PrismaClient } from "@prisma/client";
import { Octokit } from "octokit";


const prisma = new PrismaClient()

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const githubUrl = "https://github.com/adarsh-vishwakarma/opinion-orbit";

export const getCommitHashes = async (githubUrl) => {
  const pathSegments = new URL(githubUrl).pathname.split('/').filter(Boolean);
  const owner = pathSegments[0];
  const repo = pathSegments[1];
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  const sortedCommits = data.sort(
    (a, b) =>
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime()
  );

  return sortedCommits.slice(0, 15).map((commit) => ({
    commitHashes: commit.sha,
    commitMessage: commit.commit.message ?? "",
    commitAuthorName: commit.commit?.author?.name ?? "",
    commitAuthorAvatar: commit?.author?.avatar_url ?? "",
    commitDate: commit.commit?.author.date ?? "",
  }));
};

// ✅ Wrap in an async function
// async function main() {
//   console.log(await getCommitHashes(githubUrl));
// }

// main().catch(console.error);

export const pollCommits = async (projectId) => {
  const {project, githubUrl} = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl)
  const unprocessedCommits = await filterUnprocessecCommits(projectId, commitHashes)
  console.log("HII")
  console.log(unprocessedCommits)
  console.log("HIII")
  return unprocessedCommits
}



async function fetchProjectGithubUrl(projectId) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId
    },
    select: {
      githubUrl: true
    }
  })
  if(!project?.githubUrl) {
    throw new Error("Project has no github url")
  }
  return { project, githubUrl: project?.githubUrl}
}

async function filterUnprocessecCommits(projectId, commitHashes) {
  const processedCommits = await prisma.commit.findMany({
    where: {projectId}
  })
  const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash))
  return unprocessedCommits
}

pollCommits('cm8vxremx0003hp5wp3ghoe1j')

