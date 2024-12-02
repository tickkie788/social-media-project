import { db } from "../postgres.js";
import jwt from "jsonwebtoken";

export async function getLikes(req, res) {
  try {
    const postId = req.query.postId;

    const likes = await db.query(
      "SELECT user_id FROM post_likes WHERE post_id = $1",
      [postId]
    );

    return res.status(200).json(likes.rows.map((item) => item.user_id));
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}

export async function addLike(req, res) {
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

      const {postId} = req.body;

      await db.query(
        "INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2)",
        [userInfo.id, postId]
      );

      return res.status(200).json(`Post with id = ${postId} has been liked.`);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}

export async function deleteLike(req, res) {
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

      const postId = req.query.postId;

      await db.query(
        "DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2",
        [userInfo.id, postId]
      );

      return res
        .status(200)
        .json(`Post with id = ${postId} has been disliked.`);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}
