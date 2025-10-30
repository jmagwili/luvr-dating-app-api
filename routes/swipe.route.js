import { Router } from "express";
import { likeUser, checkLike, skipUser, unlikeUser } from "../controllers/swipe.controller.js";

const likeRouter = Router();

likeRouter.get("/check-like/:liker/:liked", checkLike);
likeRouter.post("/like", likeUser);
likeRouter.delete("/unlike", unlikeUser);
likeRouter.post("/skip", skipUser);

export default likeRouter;