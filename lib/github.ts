import { Octokit } from "@octokit/rest";

type CommitFile = {
  path: string;
  content: string;
  encoding?: BufferEncoding;
};

function getGithubConfig() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  return {
    token,
    owner: process.env.GITHUB_OWNER || "SupremeGoogle",
    repo: process.env.GITHUB_REPO || "GwauCread",
    branch: process.env.GITHUB_BRANCH || "main"
  };
}

export async function commitFiles(files: CommitFile[], message: string) {
  const { token, owner, repo, branch } = getGithubConfig();
  const octokit = new Octokit({ auth: token });

  const refName = `heads/${branch}`;
  let latestCommitSha: string;
  let baseTreeSha: string;

  try {
    const ref = await octokit.git.getRef({ owner, repo, ref: refName });
    latestCommitSha = ref.data.object.sha;
    const commit = await octokit.git.getCommit({ owner, repo, commit_sha: latestCommitSha });
    baseTreeSha = commit.data.tree.sha;
  } catch {
    const emptyTree = await octokit.git.createTree({ owner, repo, tree: [] });
    const firstCommit = await octokit.git.createCommit({
      owner,
      repo,
      message: "Initial site commit",
      tree: emptyTree.data.sha,
      parents: []
    });
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/${refName}`,
      sha: firstCommit.data.sha
    });
    latestCommitSha = firstCommit.data.sha;
    baseTreeSha = emptyTree.data.sha;
  }

  const treeItems = await Promise.all(
    files.map(async (file) => {
      if (file.encoding === "base64") {
        const blob = await octokit.git.createBlob({
          owner,
          repo,
          content: file.content,
          encoding: "base64"
        });

        return {
          path: file.path,
          mode: "100644" as const,
          type: "blob" as const,
          sha: blob.data.sha
        };
      }

      return {
        path: file.path,
        mode: "100644" as const,
        type: "blob" as const,
        content: file.content
      };
    })
  );

  const tree = await octokit.git.createTree({
    owner,
    repo,
    base_tree: baseTreeSha,
    tree: treeItems
  });

  const commit = await octokit.git.createCommit({
    owner,
    repo,
    message,
    tree: tree.data.sha,
    parents: [latestCommitSha]
  });

  await octokit.git.updateRef({
    owner,
    repo,
    ref: refName,
    sha: commit.data.sha,
    force: false
  });

  return commit.data.sha;
}
