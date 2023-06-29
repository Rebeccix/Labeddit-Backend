import z from "zod"

export interface likeDislikePostInputDTO {
    token: string,
    idPostToLikeDislike: string,
    like: boolean
}

export type likeDislikePostOutputDTO = undefined

export const likeDislikePostScheama = z.object({
    token: z.string().min(1),
    idPostToLikeDislike: z.string().min(1),
    like: z.boolean()
})