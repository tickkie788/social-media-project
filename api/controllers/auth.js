import { db } from "../postgres.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Check if user existed
    const user = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (!user.rows.length) {
      return res.status(401).json("Incorrect username");
    }

    // Comparing pasword
    const comparePassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!comparePassword) {
      return res.status(401).json("Incorrect password");
    }

    // Create token using user id
    const token = jwt.sign({ id: user.rows[0].id }, "secretkey");

    // Hide password before response
    user.rows[0].password = "hidden";

    // Set cookie and respond
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(user.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}

export async function register(req, res) {
  const { username, email, password, name } = req.body;

  try {
    // Check if user already existed
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (result.rows.length > 0) {
      const existingUser = result.rows[0];

      if (existingUser.username === username) {
        return res.status(409).json("Username already exists.");
      } else if (existingUser.email === email) {
        return res.status(409).json("Email already exists.");
      }
    }

    // Hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user
    await db.query(
      "INSERT INTO users (username, email, password, name) VALUES ($1, $2, $3, $4)",
      [username, email, hashedPassword, name]
    );

    // Response
    res.status(200).json("User has been created.");
  } catch (error) {
    console.error(error);
    res.status(500).json("An internal server error occurred.");
  }
}

export function logout(req, res) {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
}
