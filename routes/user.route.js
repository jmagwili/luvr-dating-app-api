import { Router } from "express";
import { 
    getUserById, 
    getUsers, 
    createUser, 
    updateUser, 
    queryUser,
    getUnviewedProfiles 
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.get("/search/:name", queryUser);
userRouter.get("/unviewed-profiles/:userId", getUnviewedProfiles);
userRouter.post("/", createUser);
userRouter.patch("/:id", updateUser);

export default userRouter;


