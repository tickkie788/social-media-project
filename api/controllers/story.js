import { db } from "../postgres.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export async function getStories(req, res) {
  try {
    // Check cookies if user already logged in?
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json("Not logged in.");
    }

    // Verify token
    jwt.verify(token, "secretkey", async (error, userInfo) => {
      if (error) {
        return res.status(403).json("Token is not valid.");
      }

      const stories = await db.query(
        `
      SELECT
        stories.*,
        users.id AS user_id,
        users.name,
        users.profile_pic
      FROM
        stories
      JOIN
        users ON stories.user_id = users.id
      LEFT JOIN
        followers ON stories.user_id = followers.following_id
      WHERE
        followers.follower_id = $1 OR stories.user_id = $1
      ORDER BY
        stories.id DESC;
      `,
        [userInfo.id]
      );

      res.status(200).json(stories.rows);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}

export async function addStory(req, res) {
  try {
    // Check cookies if user already logged in?
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json("Not logged in.");
    }

    // Verify token
    jwt.verify(token, "secretkey", async (error, useInfo) => {
      if (error) {
        return res.status(403).json("Token is not valid.");
      }

      const img = req.body.img;
      const date = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

      await db.query(
        "INSERT INTO stories (img, user_id, createat) VALUES ($1, $2, $3)",
        [img, useInfo.id, date]
      );

      res.status(200).json("Story has been uploaded.");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}

export async function deleteStory(req, res) {
  try {
    // Check cookies if user already logged in?
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json("Not logged in.");
    }

    // Verify token
    jwt.verify(token, "secretkey", async (error, userInfo) => {
      if (error) {
        return res.status(403).json("Token is not valid.");
      }

      const storyId = req.params.id;

      // Delete the story from the database
      const result = await db.query(
        "DELETE FROM stories WHERE id = $1 AND user_id = $2",
        [storyId, userInfo.id]
      );
      if (result.rowCount === 0) {
        return res
          .status(404)
          .json("Story not found or not authorized to delete.");
      }

      return res.status(200).json("Story has been deleted");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}
