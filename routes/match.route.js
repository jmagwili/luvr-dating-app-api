import { Router } from "express";
import { getMatchById, createMatch, getAllMatches } from "../controllers/match.controller.js";

const matchRouter = Router();

matchRouter.get("/:id", getAllMatches)
matchRouter.post("/", createMatch)

export default matchRouter;