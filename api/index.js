import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

// Routers
import authRouter from "./routes/auth.js";
import commentRouter from "./routes/comments.js";
import likeRouter from "./routes/likes.js";
import postRouter from "./routes/posts.js";
import userRouter from "./routes/users.js";
import followRouter from "./routes/follow.js";
import storyRouter from "./routes/stories.js";

const app = express();
const port = 5000;

// Middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(cookieParser());
app.use(express.json());

// API routes
app.use("/api/auth", authRouter);
app.use("/api/comments", commentRouter);
app.use("/api/likes", likeRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/follow", followRouter);
app.use("/api/stories", storyRouter);

// Upload image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
