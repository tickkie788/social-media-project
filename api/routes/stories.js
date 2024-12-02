import express from "express";
import { getStories, addStory, deleteStory } from "../controllers/story.js";

const storyRouter = express.Router();

storyRouter.get("/", getStories);
storyRouter.post("/", addStory);
storyRouter.delete("/:id", deleteStory);

export default storyRouter;
