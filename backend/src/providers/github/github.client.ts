import fetch from 'node-fetch';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

export class GitHubApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

export async function fetchGitHubProfile(username: string, token: string) {
  const response = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubApiError(404, `GitHub user ${username} not found.`);
    }
    if (response.status === 403) {
      throw new GitHubApiError(403, 'GitHub API rate limit exceeded or forbidden.');
    }
    throw new GitHubApiError(response.status, `GitHub API error: ${response.statusText}`);
  }

  return response.json() as Promise<any>;
}

export async function fetchGitHubRepos(username: string, token: string) {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=updated`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubApiError(404, `GitHub user ${username} not found.`);
    }
    if (response.status === 403) {
      throw new GitHubApiError(403, 'GitHub API rate limit exceeded or forbidden.');
    }
    throw new GitHubApiError(response.status, `GitHub API error: ${response.statusText}`);
  }

  return response.json() as Promise<Array<{ stargazers_count: number; language: string | null }>>;
}

export async function fetchGitHubContributions(username: string, token: string): Promise<number> {
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

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  if (!response.ok) {
    throw new GitHubApiError(response.status, `GitHub GraphQL error: ${response.statusText}`);
  }

  const json = (await response.json()) as any;
  return (
    json?.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions ?? 0
  );
}