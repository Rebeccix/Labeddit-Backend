import z from "zod"

export interface likeDislikePostInputDTO {
    token: string,
    idPostToLikeDislike: string,
    like: boolean
}

export type likeDislikePostOutputDTO = undefined

export const likeDislikePostSchema = z.object({
    token: z.string().min(1),
    idPostToLikeDislike: z.string({required_error: "'id' é obrigatório",
    invalid_type_error: "'id' deve ser do tipo string",}).min(1, "'id' deve possuir no mínimo 1 caracteres"),
    like: z.boolean()
})