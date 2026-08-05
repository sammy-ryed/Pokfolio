import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { registry } from '../providers/registry.js';
import { cacheService } from '../services/cacheService.js';
import { GitHubApiError } from '../providers/github/github.client.js';

interface ProfileParams {
  provider: string;
  identifier: string;
}

export const profileRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/api/profile/:provider/:identifier', async (req: FastifyRequest<{ Params: ProfileParams }>, reply: FastifyReply) => {
    const { provider: providerName, identifier } = req.params;

    try {
      const provider = registry.get(providerName);
      const cacheKey = `${providerName}:${identifier}`;

      // 1. Check cache first
      const cachedStats = await cacheService.get(cacheKey);
      if (cachedStats) {
        return reply.send(cachedStats);
      }

      // 2. We could pull token from req.headers if needed for token-based providers
      // For GitHub MVP, we might use a global token or none if public. 
      // Assuming env.GITHUB_TOKEN is used implicitly by the client if we didn't pass one, 
      // but let's pass it if needed. 
      // In the provider we defined `fetchRawData(identifier, token?)`. Let's pass the global token if github.
      // A better way is if the provider manages its own global tokens, but for now we'll fetch from env.
      const token = process.env.GITHUB_TOKEN; // In a real scenario, this is managed in env.ts

      // 3. Fetch raw data
      const raw = await provider.fetchRawData(identifier, token);

      // 4. Map to standardized stats
      const stats = provider.mapToCardStats(raw);

      // 5. Cache the result for an hour
      await cacheService.set(cacheKey, stats, 3600);

      return reply.send(stats);

    } catch (error: any) {
      if (error.message.startsWith('Provider not found')) {
        return reply.status(404).send({ error: error.message });
      }

      // Handle specific API errors
      if (error instanceof GitHubApiError) {
        return reply.status(error.statusCode).send({ error: error.message });
      }

      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};
