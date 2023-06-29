import express from "express"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { CommentaryController } from "../controller/CommentaryController"
import { CommentaryDatabase } from "../database/CommentaryDatabase"
import { CommentaryBusiness } from "../business/CommentaryBusiness"

export const commentaryRouter = express.Router()

const commentaryController = new CommentaryController(
    new CommentaryBusiness(
        new CommentaryDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
)

commentaryRouter.get("/:id", commentaryController.getCommentaryById)
commentaryRouter.post("/:id", commentaryController.createCommentary)
commentaryRouter.put("/:id/like", commentaryController.likeDislikeCommentary)