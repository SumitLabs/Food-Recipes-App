import express from "express";
import { db } from "./config/db.js";
import "dotenv/config";
import { favoritesTable } from "./db/schema.js";
import { ENV } from "./config/env.js";
import { eq, and } from "drizzle-orm";

const app = express();

const PORT = ENV.PORT;

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.status(200).json({ succes: true });
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: "Missing required field" });
    }

    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json(newFavorite[0]);
  } catch (error) {
    console.log("error adding favorate", error);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, parseInt(recipeId))
        )
      );
    res.status(200).json({ message: "favorate removed succcessfully" });
  } catch (error) {
    console.log("error removing a favorate", error);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userFavorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));
    res.status(200).json(userFavorites);
  } catch (error) {
    console.log("error  fetching the favorates", error);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

