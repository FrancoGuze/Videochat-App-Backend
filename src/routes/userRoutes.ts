import { Router } from "express";
import { UserServiceInterface } from "../types/userInterface";
import { createUserController } from "../controller/userController";

export const createUserRoutes = (userService: UserServiceInterface) => {
  const router = Router();
  const controller = createUserController(userService);

  router.get("/userExists/:userName", controller.userExists);

  router.get("/ping", controller.ping);

  return router;
};
