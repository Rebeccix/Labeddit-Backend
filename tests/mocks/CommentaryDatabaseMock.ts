import {
  COMMENTARY_LIKE,
  CommentaryDB,
  CommentaryWithPostInfoDB,
  CommentaryWithUserInfoDB,
  likeDislikeCommentaryDB,
} from "../../src/models/Commentary";
import { PostsDB } from "../../src/models/Posts";
import { BaseDatabase } from "../../src/database/BaseDatabase";
import { USER_ROLES, UserDB } from "../../src/models/User";

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
  {
    id: "p003",
    creator_id: "id-mock-becca",
    content: "Post test tres sem comentario",
    like: 10,
    dislike: 20,
    comments: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const commentaryMock: CommentaryDB[] = [
  {
    id: "c001",
    creator_id: "id-mock-becca",
    post_id: "p001",
    content: "content test",
    like: 1,
    dislike: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "c002",
    creator_id: "id-mock-admin",
    post_id: "p002",
    content: "content test dois",
    like: -2,
    dislike: -1,
    created_at: new Date().toISOString(),
  },
  {
    id: "c003",
    creator_id: "id-mock-becca",
    post_id: "p001",
    content: "content test tres",
    like: 1,
    dislike: 4,
    created_at: new Date().toISOString(),
  },
];

const likeDislikeCommentaryMock: likeDislikeCommentaryDB[] = [
  {
    user_id: "id-mock-becca",
    commentary_id: "c002",
    like: 1,
  },
  {
    user_id: "id-mock-becca",
    commentary_id: "c001",
    like: 0,
  },
];

export class CommentaryDatabaseMock extends BaseDatabase {
  static TABLE_USERS = "users";
  static TABLE_POSTS = "posts";
  static TABLE_COMMENTARY = "commentary";
  static LIKES_DISLIKES_TABLE = "like_dislike_commentary";

  public findPostById = async (id: string): Promise<PostsDB> => {
    const [result] = postsMock.filter((data) => data.id === id);

    return result;
  };

  public insertCommentary = async (
    commentaryDB: CommentaryDB
  ): Promise<void> => {};

  public findPostAndCommentaryById = async (
    id: string
  ): Promise<CommentaryWithPostInfoDB[] | any> => {
    const PostWithAllInfo = postsMock.map((post) => {
      const [users] = usersMock.filter((user) => user.id === post.creator_id);
      const [commentaries] = commentaryMock.filter(
        (commentary) => commentary.post_id === post.id
      );

      if (!commentaries) {
        return {
          id: post.id,
          creator_name: users.name,
          content: post.content,
          like: post.like,
          dislike: post.dislike,
          comments: post.comments,
        };
      }

      return {
        id: post.id,
        creator_name: users.name,
        content: post.content,
        like: post.like,
        dislike: post.dislike,
        comments: post.comments,
        id_commentary: commentaries.id,
        creator_id: commentaries.creator_id,
        commentary_creator_name: users.name,
        content_commentary: commentaries.content,
        like_commentary: commentaries.like,
        dislike_commentary: commentaries.dislike,
      };
    });

    const result = PostWithAllInfo.filter((data) => data.id === id);

    return result;
  };

  public GetCommentaryWithCreatorInfoById = async (
    id: string
  ): Promise<CommentaryWithUserInfoDB> => {
    const commentaryWithUserInfo = commentaryMock.map((commentary) => {
      const [user] = usersMock.filter(
        (user) => user.id === commentary.creator_id
      );

      return {
        id: commentary.id,
        creator_id: commentary.creator_id,
        post_id: commentary.post_id,
        content: commentary.content,
        like: commentary.like,
        dislike: commentary.dislike,
        created_at: commentary.created_at,
        name: user.name,
      };
    });

    const [result] = commentaryWithUserInfo.filter((data) => data.id === id);

    return result;
  };

  public findLikeDislike = async (
    likeDislikeCommentaryDB: likeDislikeCommentaryDB
  ): Promise<COMMENTARY_LIKE | undefined> => {
    const result = likeDislikeCommentaryMock.find(
      (data) =>
        data.user_id === likeDislikeCommentaryDB.user_id &&
        data.commentary_id === likeDislikeCommentaryDB.commentary_id
    );

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return COMMENTARY_LIKE.ALREADY_LIKED;
    } else {
      return COMMENTARY_LIKE.ALREADY_DISLIKED;
    }
  };

  public insertLikeDislike = async (
    likeDislikeCommentaryDB: likeDislikeCommentaryDB
  ): Promise<void> => {};

  public removeLikeDislike = async (
    likeDislikeCommentaryDB: likeDislikeCommentaryDB
  ): Promise<void> => {};

  public updateLikeDislike = async (
    likeDislikeCommentaryDB: likeDislikeCommentaryDB
  ): Promise<void> => {};

  public updateCommentary = async (
    commentary: CommentaryDB
  ): Promise<void> => {};

  public incrementPostCommentNumber = async (id: string): Promise<void> => {};

  public decrementPostCommentNumber = async (id: string): Promise<void> => {};

  public findCommentaryById = async (id: string): Promise<CommentaryDB> => {
    const [result] = commentaryMock.filter(data => data.id === id)

    return result;
  };

  public deleteCommentary = async (
    commentaryExist: CommentaryDB
  ): Promise<void> => {
  };
}
