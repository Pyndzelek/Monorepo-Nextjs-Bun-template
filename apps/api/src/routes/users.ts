import { Hono } from "hono";
import { db, users } from "@repo/db";

export const usersRoute = new Hono()
  .get("/", async (c) => {
    const result = await db.select().from(users);
    return c.json(result);
  })
  .post("/", async (c) => {
    return c.json({ message: "User created" });
  });
