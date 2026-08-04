const GITHUB_API = "https://api.github.com";

function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  };
}

export async function getGithubProfile(username: string) {
  const res = await fetch(`${GITHUB_API}/users/${username}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`GitHub profile fetch failed: ${res.status}`);
  }
  return res.json();
}

export async function getGithubRepos(username: string) {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`,
    { headers: authHeaders() }
  );
  if (!res.ok) {
    throw new Error(`GitHub repos fetch failed: ${res.status}`);
  }
  return res.json();
}

// Contribution streak isn't exposed via REST; use GraphQL.
export async function getGithubContributions(username: string) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  if (!res.ok) {
    throw new Error(`GitHub GraphQL fetch failed: ${res.status}`);
  }

  const json = await res.json();
  return json.data?.user?.contributionsCollection?.contributionCalendar
    ?.totalContributions ?? 0;
}
