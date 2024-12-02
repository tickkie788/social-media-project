import express from "express";
import { getComments, addComment } from "../controllers/comment.js";

const commentRouter = express.Router();

commentRouter.get("/", getComments);
commentRouter.post("/", addComment);

export default commentRouter;
