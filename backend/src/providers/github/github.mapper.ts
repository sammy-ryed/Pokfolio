import { CardStats, RawProfileData } from '../types.js';
import { GITHUB_WEIGHTS } from '../../config/statWeights.js';

const LANGUAGE_TYPE_MAP: Record<string, string> = {
  JavaScript: 'Electric',
  TypeScript: 'Electric',
  Python: 'Water',
  Rust: 'Fire',
  Go: 'Steel',
  Java: 'Rock',
  C: 'Fighting',
  'C++': 'Fighting',
  HTML: 'Grass',
  CSS: 'Grass',
  Ruby: 'Fire',
  Shell: 'Dark',
};

export function mapGitHubDataToCardStats(raw: RawProfileData): CardStats {
  const followers = raw.followers || 0;
  const publicRepos = raw.public_repos || 0;
  const totalStars = (raw.repos || []).reduce(
    (sum: number, r: any) => sum + (r.stargazers_count || 0),
    0
  );
  const contributions = raw.totalContributions || 0;

  const languageCounts: Record<string, number> = {};
  for (const repo of raw.repos || []) {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  }
  const topLanguage =
    Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Normal';

  const accountAgeYears = raw.created_at
    ? (Date.now() - new Date(raw.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)
    : 1;

  return {
    name: raw.name || raw.login || 'Unknown',
    avatarUrl: raw.avatar_url || '',
    hp: Math.min(100 + Math.floor(followers * GITHUB_WEIGHTS.followersToHp), 999),
    attack: Math.min(Math.floor(totalStars * GITHUB_WEIGHTS.starsToAttack), 999),
    defense: Math.min(Math.floor(publicRepos * GITHUB_WEIGHTS.reposToDefense), 999),
    speed: Math.min(Math.floor(contributions), 999),
    type: LANGUAGE_TYPE_MAP[topLanguage] ?? 'Normal',
    level: Math.max(1, Math.min(Math.floor(accountAgeYears * 10), 100)),
  };
}