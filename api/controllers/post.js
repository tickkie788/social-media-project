import { db } from "../postgres.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export async function getPosts(req, res) {
  try {
    // Check cookies if user already logged in?
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json("Not logged in.");
    }

    // Verify token and fetch posts
    jwt.verify(token, "secretkey", async (error, userInfo) => {
      if (error) {
        return res.status(403).json("Token is not valid.");
      }

      const userId = parseInt(req.query.userId); // if viewing a user profile

      let posts;

      if (userId) {
        // If userId is provided, use the first query (just posts by user)
        posts = await db.query(
          `
          SELECT 
              posts.*,
              users.name
          FROM
              posts
          JOIN
              users ON posts.user_id = users.id
          WHERE
              posts.user_id = $1
          ORDER BY 
              posts.createat DESC`,
          [userId]
        );
      } else {
        // If userId is not provided, use the second query (posts including followers' posts)
        posts = await db.query(
          `
          SELECT 
              posts.*, 
              users.id AS user_id, 
              users.name, 
              users.profile_pic, 
              followers.follower_id, 
              followers.following_id
          FROM
              posts
          JOIN
              users ON posts.user_id = users.id
          LEFT JOIN
              followers ON posts.user_id = followers.following_id
          WHERE
              followers.follower_id = $1 OR posts.user_id = $1
          ORDER BY
              posts.createat DESC
          `,
          [userInfo.id]
        );
      }

      return res.status(200).json(posts.rows);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}

export async function addPost(req, res) {
  try {
    // Check cookies if user already logged in?
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json("Not logged in.");
    }

    // Verify token and create a post
    jwt.verify(token, "secretkey", async (error, userInfo) => {
      if (error) {
        return res.status(403).json("Token is not valid.");
      }

      const { description, img } = req.body;
      const date = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

      await db.query(
        "INSERT INTO posts (description, img, user_id, createat) VALUES ($1, $2, $3, $4)",
        [description, img, userInfo.id, date]
      );

      return res.status(200).json("Post has been created.");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}

export async function deletePost(req, res) {
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

      const postId = req.params.postId;

      // Delete the post only if it belongs to the logged-in user
      const result = await db.query(
        "DELETE FROM posts WHERE id = $1 AND user_id = $2",
        [postId, userInfo.id]
      );

      // Check if a post was actually deleted
      if (result.rowCount === 0) {
        return res
          .status(404)
          .json("Post not found or not authorized to delete.");
      }

      return res.status(200).json("Post has been deleted.");
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json("An internal server error occurred.");
  }
}
