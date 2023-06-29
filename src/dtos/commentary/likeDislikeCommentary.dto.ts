import z from "zod"

export interface likeDislikeCommentaryInputDTO {
    token: string,
    idCommentaryToLikeDislike: string,
    likeOrDislike: boolean
}

export type likeDislikeCommentaryOutputDTO = undefined

export const likeDislikeCommentaryScheama = z.object({
    token: z.string().min(1),
    idCommentaryToLikeDislike: z.string().min(1),
    likeOrDislike: z.boolean()
})