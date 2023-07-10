import z from "zod";

export interface CreatePostInputDTO {
  token: string;
  content: string;
}

export type CreatePostOutputDTO = undefined;

export const CreatePostSchema = z
  .object({
    token: z.string().min(1),
    content: z
      .string({
        required_error: "'post' é obrigatório",
        invalid_type_error: "'post' deve ser do tipo string",
      })
      .min(1, "'post' deve possuir no mínimo 3 caractere"),
  })
  .transform((data) => data as CreatePostInputDTO);
