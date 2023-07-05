import z from "zod";

export interface GetPostsInputDTO {
  token: string;
}

export interface GetPostsOutputDTO {
  id: string;
  name: string;
  content: string;
  like: number;
  dislike: number;
  comments: number;
}

export const GetPostsSchema = z
  .object({
    token: z.string().min(1),
  })
  .transform((data) => data as GetPostsInputDTO);
