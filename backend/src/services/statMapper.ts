export interface CardStats {
  name: string;
  avatarUrl: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  type: string;
  level: number;
}

const LANGUAGE_TYPE_MAP: Record<string, string> = {
  JavaScript: "Electric",
  TypeScript: "Electric",
  Python: "Water",
  Rust: "Fire",
  Go: "Steel",
  Java: "Rock",
  C: "Fighting",
  "C++": "Fighting",
  HTML: "Grass",
  CSS: "Grass",
  Ruby: "Fire",
  Shell: "Dark",
};

export function mapGithubToCard(
  profile: any,
  repos: any[],
  totalContributions: number
): CardStats {
  const totalStars = repos.reduce(
    (sum, r) => sum + (r.stargazers_count ?? 0),
    0
  );

  const languageCounts: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] ?? 0) + 1;
    }
  }
  const topLanguage =
    Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "Normal";

  const accountAgeYears =
    (Date.now() - new Date(profile.created_at).getTime()) /
    (1000 * 60 * 60 * 24 * 365);

  return {
    name: profile.login,
    avatarUrl: profile.avatar_url,
    hp: Math.min(100 + profile.followers * 2, 999),
    attack: Math.min(totalStars * 3, 999),
    defense: Math.min(profile.public_repos * 4, 999),
    speed: Math.min(totalContributions, 999),
    type: LANGUAGE_TYPE_MAP[topLanguage] ?? "Normal",
    level: Math.max(1, Math.min(Math.floor(accountAgeYears * 10), 100)),
  };
}

export function mapPinterestToCard(
  account: any,
  boards: any[],
  pins: any[]
): CardStats {
  return {
    name: account.username,
    avatarUrl: account.profile_image,
    hp: Math.min(100 + (account.follower_count ?? 0) * 2, 999),
    attack: Math.min(pins.length * 2, 999),
    defense: Math.min(boards.length * 5, 999),
    speed: Math.min(account.pin_count ?? 0, 999),
    type: "Fairy",
    level: 1,
  };
}
