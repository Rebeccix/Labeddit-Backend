export interface PostsDB {
  id: string;
  creator_id: string;
  content: string;
  like: number;
  comments: number;
  created_at: string;
  updated_at: string;
}

export interface PostsModel {}

export interface PostsWithCreatorNameDB {
  id: string;
  creator_id: string;
  content: string;
  like: number;
  comments: number;
  created_at: string;
  updated_at: string;
  name: string;
}

export interface PostsWithCreatorNameModel {
  id: string;
  name: string;
  content: string;
  like: number;
  comments: number;
}

export class Posts {
  constructor(
    private id: string,
    private creatorId: string,
    private content: string,
    private like: number,
    private comments: number,
    private createdAt: string,
    private updatedAt: string,
    private name: string
  ) {}

  public toPostsDB(): PostsDB {
    return {
      id: this.id,
      creator_id: this.creatorId,
      content: this.content,
      like: this.like,
      comments: this.comments,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  public toPostsModelWithNameModel(): PostsWithCreatorNameModel {
    return {
      id: this.id,
      name: this.name,
      content: this.content,
      like: this.like,
      comments: this.comments,
    };
  }
}
