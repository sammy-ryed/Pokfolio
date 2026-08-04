import type { FastifyInstance } from "fastify";
import { mapPinterestToCard } from "../services/statMapper.js";

// NOTE: Pinterest only returns data for the authenticated user.
// Flow: user clicks "Connect Pinterest" -> redirected to Pinterest ->
// callback exchanges code for token -> token stored against user session.

const PINTEREST_AUTH_URL = "https://www.pinterest.com/oauth/";
const PINTEREST_TOKEN_URL = "https://api.pinterest.com/v5/oauth/token";
const PINTEREST_API = "https://api.pinterest.com/v5";

export default async function pinterestRoutes(app: FastifyInstance) {
  // Step 1: redirect user to Pinterest consent screen
  app.get("/auth", async (_request, reply) => {
    const params = new URLSearchParams({
      client_id: process.env.PINTEREST_CLIENT_ID ?? "",
      redirect_uri: process.env.PINTEREST_REDIRECT_URI ?? "",
      response_type: "code",
      scope: "boards:read,pins:read,user_accounts:read",
    });
    return reply.redirect(`${PINTEREST_AUTH_URL}?${params.toString()}`);
  });

  // Step 2: Pinterest redirects back here with a code
  app.get("/auth/callback", async (request, reply) => {
    const { code } = request.query as { code: string };

    const tokenRes = await fetch(PINTEREST_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`
          ).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.PINTEREST_REDIRECT_URI ?? "",
      }),
    });

    const tokenData = await tokenRes.json();

    // TODO: store tokenData.access_token against the user's session/DB row
    // instead of returning it directly to the client.
    return reply.send({ message: "Connected", token: tokenData });
  });

  // Step 3: fetch the connected user's Pinterest stats
  app.get("/me", async (request, reply) => {
    const accessToken = request.headers.authorization?.replace("Bearer ", "");
    if (!accessToken) {
      return reply.status(401).send({ error: "Missing Pinterest token" });
    }

    const headers = { Authorization: `Bearer ${accessToken}` };

    const [accountRes, boardsRes, pinsRes] = await Promise.all([
      fetch(`${PINTEREST_API}/user_account`, { headers }),
      fetch(`${PINTEREST_API}/boards`, { headers }),
      fetch(`${PINTEREST_API}/pins`, { headers }),
    ]);

    const account = await accountRes.json();
    const boardsData = await boardsRes.json();
    const pinsData = await pinsRes.json();

    const stats = mapPinterestToCard(
      account,
      boardsData.items ?? [],
      pinsData.items ?? []
    );

    return reply.send(stats);
  });
}
