import type { FastifyInstance } from "fastify";
import {
  getGithubProfile,
  getGithubRepos,
  getGithubContributions,
} from "../services/githubService.js";
import { mapGithubToCard } from "../services/statMapper.js";

export default async function githubRoutes(app: FastifyInstance) {
  app.get("/:username", async (request, reply) => {
    const { username } = request.params as { username: string };

    try {
      const [profile, repos, contributions] = await Promise.all([
        getGithubProfile(username),
        getGithubRepos(username),
        getGithubContributions(username),
      ]);

      const stats = mapGithubToCard(profile, repos, contributions);
      return reply.send(stats);
    } catch (err: any) {
      request.log.error(err);
      return reply.status(404).send({ error: "Could not fetch GitHub user" });
    }
  });
}
