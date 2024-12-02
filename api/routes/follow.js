import express from "express";
import {
  getFollowers,
  addFollowers,
  deleteFollowers,
} from "../controllers/follow.js";

const followRouter = express.Router();

followRouter.get("/", getFollowers);
followRouter.post("/", addFollowers);
followRouter.delete("/", deleteFollowers);

export default followRouter;
