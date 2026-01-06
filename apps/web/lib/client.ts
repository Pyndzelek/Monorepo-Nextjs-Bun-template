import { hc } from "hono/client";
import type { AppType } from "api/src/index";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");
}

export const client = hc<AppType>(apiUrl);
