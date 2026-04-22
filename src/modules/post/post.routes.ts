import { Router } from "express";
import { postController } from "./post.controller";

const router = Router();

router.post("/", postController.postCreate);

export const postRouter = router;