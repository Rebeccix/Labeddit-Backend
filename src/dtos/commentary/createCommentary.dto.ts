import z from "zod";

export interface CreateCommentaryPostInputDTO {
  token: string;
  id: string;
  content: string;
}

export type CreateCommentaryPostOutputDTO = undefined;

export const CreateCommentaryPostScheama = z
  .object({
    token: z.string().min(1),
    id: z
      .string({
        required_error: "'id' é obrigatório",
        invalid_type_error: "'id' deve ser do tipo string",
      })
      .min(1, "'id' deve possuir no mínimo 1 caractere"),
    content: z
      .string({
        required_error: "'comentário' é obrigatório",
        invalid_type_error: "'comentário' deve ser do tipo string",
      })
      .min(1, "'comentário' deve possuir no mínimo 1 caractere"),
  })
  .transform((data) => data as CreateCommentaryPostInputDTO);
