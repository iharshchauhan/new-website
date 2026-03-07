import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import http from "node:http";
import { URL } from "node:url";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI || "http://127.0.0.1:8787/callback";
const SCOPES = ["user-top-read"];

function ensureEnv() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error(
      "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env.local.",
    );
    process.exit(1);
  }
}

function createAuthorizeUrl() {
  const url = new URL("https://accounts.spotify.com/authorize");
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("scope", SCOPES.join(" "));
  return url.toString();
}

async function exchangeCodeForTokens(code) {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64",
  );

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data, null, 2));
  }

  return data;
}

async function printAuthUrl() {
  ensureEnv();
  console.log("Open this URL and authorize the Spotify app:");
  console.log(createAuthorizeUrl());
  console.log("");
  console.log(
    `After approval, Spotify will redirect to ${REDIRECT_URI} with a code.`,
  );
}

async function exchangeCode(code) {
  ensureEnv();

  if (!code) {
    console.error("Usage: npm run spotify:auth -- exchange <spotify_code>");
    process.exit(1);
  }

  const tokenData = await exchangeCodeForTokens(code);

  console.log("");
  console.log("Spotify tokens received:");
  console.log(JSON.stringify(tokenData, null, 2));
  console.log("");
  console.log(
    `Add this to .env.local:\nSPOTIFY_REFRESH_TOKEN="${tokenData.refresh_token}"`
  );
}

async function listenForCallback() {
  ensureEnv();

  const redirect = new URL(REDIRECT_URI);
  const port = Number(redirect.port || (redirect.protocol === "https:" ? 443 : 80));
  const hostname = redirect.hostname;
  const callbackPath = redirect.pathname;
  const authUrl = createAuthorizeUrl();

  const server = http.createServer(async (req, res) => {
    const reqUrl = new URL(req.url || "/", REDIRECT_URI);

    if (reqUrl.pathname !== callbackPath) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found.");
      return;
    }

    const error = reqUrl.searchParams.get("error");
    const code = reqUrl.searchParams.get("code");

    if (error || !code) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Spotify authorization failed: ${error || "missing code"}`);
      server.close();
      process.exitCode = 1;
      return;
    }

    try {
      const tokenData = await exchangeCodeForTokens(code);

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        "<h1>Spotify authorization complete.</h1><p>You can close this tab and return to the terminal.</p>",
      );

      console.log("");
      console.log("Spotify tokens received:");
      console.log(JSON.stringify(tokenData, null, 2));
      console.log("");
      console.log(
        `Add this to .env.local:\nSPOTIFY_REFRESH_TOKEN="${tokenData.refresh_token}"`
      );

      server.close();
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Token exchange failed. Check terminal output.");
      console.error(err instanceof Error ? err.message : err);
      server.close();
      process.exitCode = 1;
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Listening for Spotify callback on ${REDIRECT_URI}`);
    console.log("");
    console.log("Add this exact redirect URI to your Spotify app settings first:");
    console.log(REDIRECT_URI);
    console.log("");
    console.log("Then open this URL in your browser:");
    console.log(authUrl);
  });
}

async function main() {
  const [, , command, value] = process.argv;

  if (!command || command === "help" || command === "--help") {
    console.log("Spotify auth helper");
    console.log("");
    console.log("Commands:");
    console.log("  npm run spotify:auth -- url");
    console.log("  npm run spotify:auth -- listen");
    console.log("  npm run spotify:auth -- exchange <spotify_code>");
    return;
  }

  if (command === "url") {
    await printAuthUrl();
    return;
  }

  if (command === "listen") {
    await listenForCallback();
    return;
  }

  if (command === "exchange") {
    await exchangeCode(value);
    return;
  }

  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
