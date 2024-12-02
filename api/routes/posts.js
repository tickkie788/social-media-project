import express from "express";
import { getPosts, addPost, deletePost } from "../controllers/post.js";

const postRouter = express.Router();

postRouter.get("/", getPosts);
postRouter.post("/", addPost);
postRouter.delete("/:postId", deletePost);

export default postRouter;
