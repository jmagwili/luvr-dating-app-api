import { Router } from "express";
import { likeUser, checkLike } from "../controllers/like.controller.js";

const likeRouter = Router();

likeRouter.get("/:liker/:liked", checkLike);
likeRouter.post("/", likeUser);

export default likeRouter;