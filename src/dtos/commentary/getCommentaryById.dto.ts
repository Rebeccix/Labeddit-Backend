import z from "zod";

export interface GetCommentaryByIdInputDTO {
  token: string;
  id: string;
}

export interface CommentDTO {
    idCommentary: string;
    creatorId: string;
    commentaryCreatorName?: string;
    contentCommentary: string;
    likeCommentary: number;
}

export interface GetCommentaryByIdOutputDTO {
  id?: string;
  creatorName?: string;
  content?: string;
  like?: number;
  comments?: number;
  commentaries: CommentDTO[];
}

export const GetCommentaryByIdScheama = z
  .object({
    token: z.string().min(1),
    id: z.string().min(1),
  })
  .transform((data) => data as GetCommentaryByIdInputDTO);
