import z from "zod";

export interface likeDislikeCommentaryInputDTO {
  token: string;
  idCommentaryToLikeDislike: string;
  likeOrDislike: boolean;
}

export type likeDislikeCommentaryOutputDTO = undefined;

export const likeDislikeCommentaryScheama = z.object({
  token: z.string().min(1),
  idCommentaryToLikeDislike: z
    .string({
      required_error: "'id' é obrigatório",
      invalid_type_error: "'id' deve ser do tipo string",
    })
    .min(1, "'id' deve possuir no mínimo 1 caractere"),
  likeOrDislike: z.boolean(),
});
