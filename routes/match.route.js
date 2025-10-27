import { Router } from "express";
import { getMatchById, createMatch } from "../controllers/match.controller.js";

const matchRouter = Router();

matchRouter.get("/:id", getMatchById)
matchRouter.post("/", createMatch)

export default matchRouter;