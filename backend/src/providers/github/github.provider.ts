import { Provider, CardStats, RawProfileData } from '../types.js';
import { fetchGitHubProfile, fetchGitHubRepos, fetchGitHubContributions } from './github.client.js';
import { mapGitHubDataToCardStats } from './github.mapper.js';

export const githubProvider: Provider = {
  name: 'github',

  fetchRawData: async (identifier: string, token?: string): Promise<RawProfileData> => {
    if (!token) {
      throw new Error('GitHub provider requires a token');
    }

    const [profile, repos, totalContributions] = await Promise.all([
      fetchGitHubProfile(identifier, token),
      fetchGitHubRepos(identifier, token),
      fetchGitHubContributions(identifier, token),
    ]);

    return { ...profile, repos, totalContributions };
  },

  mapToCardStats: (raw: RawProfileData): CardStats => mapGitHubDataToCardStats(raw),
};