import express from "express";
import { getLikes, addLike, deleteLike } from "../controllers/like.js";

const likeRouter = express.Router();

likeRouter.get("/", getLikes);
likeRouter.post("/", addLike);
likeRouter.delete("/", deleteLike);

export default likeRouter;
