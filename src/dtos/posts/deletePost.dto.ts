import z from "zod";

export interface deletePostInput {
  token: string;
  id: string;
}

export type deletePostOutput = undefined;

export const deletePostSchema = z.object({
  token: z.string().min(1),
  id: z
    .string({
      required_error: "'id' é obrigatório",
      invalid_type_error: "'id' deve ser do tipo string",
    })
    .min(1, "'id' deve possuir no mínimo 1 caractere"),
});
