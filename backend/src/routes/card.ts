import type { FastifyInstance } from "fastify";

// This route will take mapped stats (from github.ts or pinterest.ts)
// and render them into a card image using Satori + resvg.
// Left as a stub — plug in cardGenerator.ts once the template is designed.

export default async function cardRoutes(app: FastifyInstance) {
  app.post("/generate", async (request, reply) => {
    const stats = request.body;

    // TODO:
    // 1. Render Satori JSX template with `stats`
    // 2. Convert SVG -> PNG via @resvg/resvg-js
    // 3. Upload PNG to storage (S3/Cloudinary), get URL
    // 4. Save { stats, imageUrl } to DB
    // 5. Return imageUrl to client

    return reply.status(501).send({ error: "Not implemented yet", stats });
  });
}
