import { Request, Response } from "express";
import { UserServiceInterface } from "../types/userInterface";

export const createUserController = (userService: UserServiceInterface) => {
    const userExists = (req: Request, res: Response) => {
        const userName = req.params.userName;
        const exists = userService.findUserSocket(userName);
        console.log(userName, "||", exists);
        if (!exists) {
            res.status(200).json({ exists:false, message: "This user name can be used!" });
        } else {
            res.status(409).json({ exists: true, message: "This user name cannot be used..." });
        }
    };

    const ping = (_req: Request, res: Response) => {
        res.status(200).send("pong");
    };

    return { userExists, ping };
};
