import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { usersRoute } from "./routes/users";

const app = new Hono();

app.use("*", cors());
app.use("*", logger());

const routes = app
  .route("/users", usersRoute)
  .get("/health", (c) => c.json({ status: "ok", uptime: process.uptime() }));

//RPC
export type AppType = typeof routes;

const port = parseInt(process.env.PORT || "5000");
console.log(`Server running on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
