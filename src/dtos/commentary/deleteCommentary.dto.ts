import z from "zod"

export interface deleteCommentaryInput {
    token: string,
    id: string
}

export type deleteCommentaryOutput = undefined

export const deleteCommentarySchema = z.object({
    token: z.string().min(1),
    id: z
      .string({
        required_error: "'id' é obrigatório",
        invalid_type_error: "'id' deve ser do tipo string",
      })
      .min(1, "'id' deve possuir no mínimo 1 caractere"),
}).transform(data => data as deleteCommentaryInput)