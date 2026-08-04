import Fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";

import githubRoutes from "./routes/github.js";
import pinterestRoutes from "./routes/pinterest.js";
import cardRoutes from "./routes/card.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
});

app.get("/health", async () => ({ status: "ok" }));

await app.register(githubRoutes, { prefix: "/api/github" });
await app.register(pinterestRoutes, { prefix: "/api/pinterest" });
await app.register(cardRoutes, { prefix: "/api/card" });

const port = Number(process.env.PORT ?? 4000);

app.listen({ port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
