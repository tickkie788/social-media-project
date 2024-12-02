import { db } from "../postgres.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export async function getComments(req, res) {
  try {
    const postId = req.query.postId;

    const comments = await db.query(
      `SELECT
        comments.*,
        users.name,
        users.profile_pic
      FROM
        comments
      JOIN
        users ON comments.user_id = users.id
      WHERE
        comments.post_id = $1
      ORDER BY
        comments.createat DESC`,
      [postId]
    );

    return res.status(200).json(comments.rows);
    
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}

export async function addComment(req, res) {
  try {
    // Check cookies if user already logged in?
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json("Not logged in.");
    }

    // Verify token and create a comment
    jwt.verify(token, "secretkey", async (error, userInfo) => {
      if (error) {
        return res.status(403).json("Token is not valid.");
      }

      const { description, postId } = req.body;
      const date = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

      await db.query(
        "INSERT INTO comments (description, createat, user_id, post_id) VALUES ($1, $2, $3, $4)",
        [description, date, userInfo.id, postId]
      );

      return res.status(200).json("Comment has been created.");

    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}
