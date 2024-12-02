import express from "express";
import {
  getUser,
  updateUser,
  getSuggestions,
  getFriends
} from "../controllers/user.js";

const userRouter = express.Router();

userRouter.get("/find/:userId", getUser);
userRouter.put("/", updateUser);
userRouter.get("/suggestions", getSuggestions);
userRouter.get("/friends", getFriends);

export default userRouter;
