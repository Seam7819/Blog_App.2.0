import express  from "express";
import { postRouter } from "./modules/post/post.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

app.use(express.json());
app.all('/api/auth/*splat', toNodeHandler(auth));
app.use("/posts", postRouter);

export default app;