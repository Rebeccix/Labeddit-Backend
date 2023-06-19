import z from "zod"

export interface CreateCommentaryPostInputDTO {
    token: string,
    id: string,
    content: string
}

export type CreateCommentaryPostOutputDTO = undefined

export const CreateCommentaryPostScheama = z.object({
    token: z.string().min(1),
    id: z.string().min(1),
    content: z.string().min(1)
}).transform(data => data as CreateCommentaryPostInputDTO)