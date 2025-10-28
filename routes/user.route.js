import { Router } from "express";
import { getUsers, createUser, updateUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.post("/", createUser);
userRouter.post("/update/:id", updateUser);

export default userRouter;


