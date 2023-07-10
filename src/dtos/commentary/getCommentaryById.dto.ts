import z from "zod";

export interface GetCommentaryByIdInputDTO {
  token: string;
  id: string;
}

export interface CommentDTO {
    idCommentary?: string;
    creatorId?: string;
    commentaryCreatorName?: string;
    contentCommentary?: string;
    likeCommentary?: number;
}

export interface GetCommentaryByIdOutputDTO {
  id?: string;
  creatorName?: string;
  content?: string;
  like?: number;
  dislike?: number;
  comments?: number;
  commentaries?: CommentDTO[];
}

export const GetCommentaryByIdScheama = z
  .object({
    token: z.string().min(1),
    id: z
    .string({
      required_error: "'id' é obrigatório",
      invalid_type_error: "'id' deve ser do tipo string",
    })
    .min(1, "'id' deve possuir no mínimo 1 caractere"),
  })
  .transform((data) => data as GetCommentaryByIdInputDTO);
