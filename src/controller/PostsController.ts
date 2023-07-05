import { Request, Response } from "express";
import { PostsBusiness } from "../business/PostsBusiness";
import { CreatePostSchema } from "../dtos/posts/createPost.dto"
import { ZodError } from "zod"
import { BaseError } from "../errors/BaseError"
import { GetPostsSchema } from "../dtos/posts/getPosts.dto";
import { likeDislikePostSchema } from "../dtos/posts/likeDislike.dto";

export class PostsController {
    constructor(
        private postsBusiness: PostsBusiness
    ){}

    public createPost = async (req: Request, res: Response) => {
        try {
            const input = CreatePostSchema.parse({
                token: req.headers.authorization,
                content: req.body.content
            })

            const output = await this.postsBusiness.createPost(input)

            return res.status(201).send(output)

        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
              res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
              res.status(error.statusCode).send(error.message)
            } else {
              res.status(500).send("Erro inesperado")
            }
        }
    }

    public getPosts = async (req: Request, res: Response) => {
      try {
        const input = GetPostsSchema.parse({
          token: req.headers.authorization
        })

        const output = await this.postsBusiness.getPosts(input)

        return res.status(200).send(output)

      } catch (error) {
        console.log(error)
        if (error instanceof ZodError) {
          res.status(400).send(error.issues)
        } else if (error instanceof BaseError) {
          res.status(error.statusCode).send(error.message)
        } else {
          res.status(500).send("Erro inesperado")
        }
      }     
    }

    public likeDislikePost = async (req: Request, res: Response) => {
      try {
        const input = likeDislikePostSchema.parse({
          token: req.headers.authorization,
          idPostToLikeDislike: req.params.id,
          like: req.body.like
        })
  
        const output = await this.postsBusiness.likeDislikePost(input)
  
        res.status(200).send(output)
      } catch (error) {
        console.log(error)
        if (error instanceof ZodError) {
          res.status(400).send(error.issues)
        } else if (error instanceof BaseError) {
          res.status(error.statusCode).send(error.message)
        } else {
          res.status(500).send("Erro inesperado")
        }
      }
    }
}