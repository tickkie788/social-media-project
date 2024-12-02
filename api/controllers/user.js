import { db } from "../postgres.js";
import jwt from "jsonwebtoken";

export async function getUser(req, res) {
  try {
    const userId = parseInt(req.params.userId);

    const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

    // If the user does not exist, return a 404 error
    if (user.rows.length === 0) {
      return res.status(404).json("User not found.");
    }

    // Destructure the user row for convenience
    const userData = user.rows[0];

    // Mask sensitive data (password)
    userData.password = "hidden";

    // Provide default images if profile or cover picture is missing
    if (!userData.cover_pic) {
      await db.query("UPDATE users SET cover_pic = $1 WHERE id = $2", [
        "default_cover.jpg",
        userId,
      ]);
    }
    if (!userData.profile_pic) {
      await db.query("UPDATE users SET profile_pic = $1 WHERE id = $2", [
        "default_profile.jpg",
        userId,
      ]);
    }

    return res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}

export async function updateUser(req, res) {
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

      const { name, city, website, cover_pic, profile_pic } = req.body;

      await db.query(
        "UPDATE users SET name = $1, cover_pic = $2, profile_pic = $3, city = $4, website = $5 WHERE id = $6",
        [name, cover_pic, profile_pic, city, website, userInfo.id]
      );

      res.status(200).json(`Updated profile with id = ${userInfo.id}`);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}

export async function getSuggestions(req, res) {
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

      // Fetch all users except the logged-in user
      const users = await db.query(
        `SELECT 
          users.id, 
          users.name, 
          users.profile_pic
        FROM 
          users
        WHERE 
          users.id != $1
          AND 
          users.id NOT IN (
            SELECT 
                following_id 
            FROM 
                followers 
            WHERE 
                follower_id = $1)
        `,
        [userInfo.id]
      );

      // If no other users are found
      if (users.rows.length === 0) {
        return res.status(204).json([]);
      }

      res.status(200).json(users.rows);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}

export async function getFriends(req, res) {
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

      const friends = await db.query(
        `SELECT
          users.id, 
          users.name, 
          users.profile_pic
        FROM 
          followers
        JOIN 
          users ON followers.following_id = users.id
        WHERE 
          followers.follower_id = $1
        `,
        [userInfo.id]
      );

      // If no friends are found
      if (friends.rows.length === 0) {
        return res.status(204).json([]);
      }

      res.status(200).json(friends.rows);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}
