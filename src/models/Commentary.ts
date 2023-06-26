import { PostsWithCreatorNameModel } from "../models/Posts";

export interface CommentaryDB {
  id: string;
  creator_id: string;
  post_id: string;
  content: string;
  like: number;
  dislike: number;
  created_at: string;
}

export interface CommentaryModel {}

export interface CommentaryWithPostInfoDB {
  id: string;
  creator_name: string;
  content: string;
  like: number;
  dislike: number;
  comments: number;
  id_commentary: string;
  creator_id: string;
  commentary_creator_name: string;
  content_commentary: string;
  like_commentary: number;
  dislike_commentary: number;
}

export interface CommentsDB {
  id_commentary: string;
  creator_id: string;
  commentary_creator_name: string;
  content_commentary: string;
  like_commentary: number;
}

export interface PostWithCommentsDB {
  id: string;
  creator_name: string;
  content: string;
  like: number;
  dislike: number;
  comments: number;
  commentaries: CommentsDB[];
}

export interface CommentsModel {
  idCommentary: string;
  creatorId: string;
  commentaryCreatorName?: string;
  contentCommentary: string;
  likeCommentary: number;
}

export interface PostWihCommentModel {
  id?: string;
  creatorName?: string;
  content?: string;
  like?: number;
  dislike?: number;
  comments?: number;
  commentaries: CommentsModel[];
}

export class Commentary {
  constructor(
    private id: string,
    private creatorId: string,
    private postId: string,
    private content: string,
    private like: number,
    private dislike: number,
    private createdAt: string,
    private commentaryCreator?: string,
    private postCreator?: PostsWithCreatorNameModel
  ) {}

  getId(): string {
    return this.id;
  }

  getCreatorId(): string {
    return this.creatorId;
  }

  getPostId(): string {
    return this.postId;
  }

  getContent(): string {
    return this.content;
  }

  getLike(): number {
    return this.like;
  }

  getDislike(): number {
    return this.dislike;
  }

  getCreatedAt(): string {
    return this.createdAt;
  }

  getCommentaryCreator(): string | undefined {
    return this.commentaryCreator;
  }

  getPostCreator(): PostsWithCreatorNameModel | undefined {
    return this.postCreator;
  }

  public toCommentaryDB(): CommentaryDB {
    return {
      id: this.id,
      creator_id: this.creatorId,
      post_id: this.postId,
      content: this.content,
      like: this.like,
      dislike: this.dislike,
      created_at: this.createdAt,
    };
  }
}
