import { db } from "../postgres.js";
import jwt from "jsonwebtoken";

export async function getFollowers(req, res) {
  try {
    const userId = req.query.userId;

    const followers = await db.query(
      "SELECT follower_id FROM followers WHERE following_id = $1",
      [userId]
    );

    return res.status(200).json(followers.rows.map((item) => item.follower_id));
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}

export async function addFollowers(req, res) {
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

      const { userId } = req.body;

      await db.query(
        "INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)",
        [userInfo.id, userId]
      );

      return res
        .status(200)
        .json(`User with id = ${userId} has been followed.`);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}

export async function deleteFollowers(req, res) {
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

      const userId = req.query.userId;

      await db.query(
        "DELETE FROM followers WHERE follower_id = $1 AND following_id = $2",
        [userInfo.id, userId]
      );

      return res
        .status(200)
        .json(`User with id = ${userId} has been unfollowed.`);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}
