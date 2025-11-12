const express = require("express");
const router = express.Router();
const axios = require("axios");

// GET /readme?url=<GitHub_repo_URL>
router.get("/", async (req, res) => {
  const repoUrl = req.query.url;
  if (!repoUrl) {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
  }

  let owner, repo;
  try {
    const urlObj = new URL(repoUrl);
    if (!urlObj.hostname.includes("github.com")) {
      return res.status(400).json({ error: "URL must be a GitHub repository URL" });
    }
    const segments = urlObj.pathname.replace(/^\/+|\/+$/g, "").split("/");
    owner = segments[0];
    repo = segments[1];
    if (!owner || !repo) {
      return res.status(400).json({ error: "Invalid GitHub repository URL format" });
    }
  } catch (err) {
    return res.status(400).json({ error: "Invalid URL provided" });
  }

  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const githubRes = await axios.get(apiUrl);
    const data = githubRes.data;
    if (data && data.content) {
      let contentStr;
      if (data.encoding === "base64") {
        const buffer = Buffer.from(data.content, "base64");
        contentStr = buffer.toString("utf-8");
      } else {
        contentStr = data.content;
      }
      res.type("text/plain").send(contentStr);
    } else {
      res.status(404).json({ error: "README not found in the repository" });
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: "Repository not found or no README available" });
    }
    console.error("GitHub API error:", err.message);
    res.status(500).json({ error: "Failed to fetch README from GitHub" });
  }
});

module.exports = router;
