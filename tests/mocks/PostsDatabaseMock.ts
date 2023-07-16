import {
  POST_LIKE,
  PostsDB,
  PostsWithCreatorNameDB,
  likeDislikePostDB,
} from "../../src/models/Posts";
import { BaseDatabase } from "../../src/database/BaseDatabase";
import { USER_ROLES, UserDB } from "../../src/models/User";

const postsMock: PostsDB[] = [
  {
    id: "p001",
    creator_id: "id-mock-becca",
    content: "Post test um",
    like: 2,
    dislike: 0,
    comments: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p002",
    creator_id: "id-mock-admin",
    content: "Post test dois",
    like: -1,
    dislike: 5,
    comments: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const usersMock: UserDB[] = [
  {
    id: "id-mock-becca",
    name: "becca",
    email: "becca@email.com",
    password: "hash-mock-becca",
    role: USER_ROLES.NORMAL,
    created_at: new Date().toISOString(),
  },
  {
    id: "id-mock-admin",
    name: "admin",
    email: "admin@email.com",
    password: "hash-mock-admin",
    role: USER_ROLES.ADMIN,
    created_at: new Date().toISOString(),
  },
];

const likeDislikePostMock: likeDislikePostDB[] = [
  {
    user_id: "id-mock-becca",
    post_id: "p002",
    like: 1,
  },
  {
    user_id: "id-mock-admin",
    post_id: "p001",
    like: -1,
  },
];

export class PostsDatabaseMock extends BaseDatabase {
  public static TABLE_POST = "posts";
  public static TABLE_USER = "users";
  public static TABLE_LIKE_DISLIKE = "like_dislike_post";

  public insertPost = async (postDB: PostsDB): Promise<void> => {};

  public findPostByCreatorId = async (
    creatorId: string
  ): Promise<PostsDB[] | undefined> => {
    const result = postsMock.filter((data) => data.creator_id === creatorId);

    return result;
  };

  public getPostsWithCreatorName = async (): Promise<
    PostsWithCreatorNameDB[]
  > => {
    const result = postsMock.map((post) => {
      const creatorPost = usersMock.find((user) => user.id === post.creator_id);

      return {
        ...post,
        name: creatorPost?.name || "",
        email: creatorPost?.email || "",
        password: creatorPost?.password || "",
        role: creatorPost?.role || "",
      };
    });

    return result;
  };

  public getPostWithCreatorNameById = async (
    id: string
  ): Promise<PostsWithCreatorNameDB | undefined> => {
    const postWithCreatorName = postsMock.map((post) => {
      const creatorPost = usersMock.find((user) => user.id === post.creator_id);

      return {
        ...post,
        name: creatorPost?.name || "",
        email: creatorPost?.email || "",
        password: creatorPost?.password || "",
        role: creatorPost?.role || "",
      };
    });
    const result = postWithCreatorName.filter((data) => data.id === id)[0];

    return result;
  };

  public updatePost = async (postDB: PostsDB): Promise<void> => {};

  public findLikeDislike = async (
    likeDislikeDB: likeDislikePostDB
  ): Promise<POST_LIKE | undefined> => {
    const [result] = likeDislikePostMock.filter(
      (data) =>
        data.user_id === likeDislikeDB.user_id &&
        data.post_id === likeDislikeDB.post_id
    );

    if (!result) {
      return undefined;
    } else if (result.like === 1) {
      return POST_LIKE.ALREADY_LIKED;
    } else {
      return POST_LIKE.ALREADY_DISLIKED;
    }
  };

  public insertLikeDislikePost = async (
    likeDislikeDB: likeDislikePostDB
  ): Promise<void> => {};

  public removeLikeDislikePost = async (
    likeDislikeDB: likeDislikePostDB
  ): Promise<void> => {};

  public updateLikeDislikePost = async (
    likeDislikeDB: likeDislikePostDB
  ): Promise<void> => {};

  public deletePostById = async (id: string): Promise<void> => {};
}
