import { Router } from "express";
import { getMatchById, createMatch, getAllMatches, deleteMatch } from "../controllers/match.controller.js";

const matchRouter = Router();

matchRouter.get("/:id", getAllMatches)
matchRouter.post("/", createMatch)
matchRouter.delete("/:id", deleteMatch)

export default matchRouter;