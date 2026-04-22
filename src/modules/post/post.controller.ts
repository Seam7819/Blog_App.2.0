import { Request, Response } from "express";
import { postService } from "./post.service";


const postCreate = async (req: Request, res:Response) => {
    // console.log(req.body);
    try{
        const result = await postService.createPost(req.body);
        res.status(201).json({
            success : true,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Failed to create post",
            error : error instanceof Error ? error.message : "Unknown error"
        })
    }
};

export const postController = 
 { postCreate ,

 };