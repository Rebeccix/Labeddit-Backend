import {
  POST_LIKE,
  PostsDB,
  PostsWithCreatorNameDB,
  likeDislikePostDB,
} from "../models/Posts";
import { BaseDatabase } from "./BaseDatabase";

export class PostsDatabase extends BaseDatabase {
  public static TABLE_POST = "posts";
  public static TABLE_USER = "users";
  public static TABLE_COMMENTARY = "commentary";
  public static TABLE_LIKE_DISLIKE = "like_dislike_post";

  public insertPost = async (postDB: PostsDB): Promise<void> => {
    await BaseDatabase.connection(PostsDatabase.TABLE_POST).insert(postDB);
  };

  public findPostByCreatorId = async (
    creatorId: string
  ): Promise<PostsDB[] | undefined> => {
    const result: Array<PostsDB> | undefined = await BaseDatabase.connection(
      PostsDatabase.TABLE_POST
    ).where("creator_id", creatorId);

    return result;
  };

  public getPostsWithCreatorName = async (): Promise<
    PostsWithCreatorNameDB[]
  > => {
    const result: PostsWithCreatorNameDB[] = await BaseDatabase.connection(
      PostsDatabase.TABLE_POST
    )
      .select(
        `${PostsDatabase.TABLE_POST}.id`,
        `${PostsDatabase.TABLE_POST}.creator_id`,
        `${PostsDatabase.TABLE_POST}.content`,
        `${PostsDatabase.TABLE_POST}.like`,
        `${PostsDatabase.TABLE_POST}.dislike`,
        `${PostsDatabase.TABLE_POST}.comments`,
        `${PostsDatabase.TABLE_POST}.created_at`,
        `${PostsDatabase.TABLE_POST}.updated_at`,
        `${PostsDatabase.TABLE_USER}.name`,
        `${PostsDatabase.TABLE_USER}.email`,
        `${PostsDatabase.TABLE_USER}.password`,
        `${PostsDatabase.TABLE_USER}.role`
      )
      .join(
        PostsDatabase.TABLE_USER,
        `${PostsDatabase.TABLE_POST}.creator_id`,
        "=",
        `${PostsDatabase.TABLE_USER}.id`
      );

    return result;
  };

  public getPostWithCreatorNameById = async (
    id: string
  ): Promise<PostsWithCreatorNameDB | undefined> => {
    const [result]: PostsWithCreatorNameDB[] = await BaseDatabase.connection(
      PostsDatabase.TABLE_POST
    )
      .select(
        `${PostsDatabase.TABLE_POST}.id`,
        `${PostsDatabase.TABLE_POST}.creator_id`,
        `${PostsDatabase.TABLE_POST}.content`,
        `${PostsDatabase.TABLE_POST}.like`,
        `${PostsDatabase.TABLE_POST}.dislike`,
        `${PostsDatabase.TABLE_POST}.comments`,
        `${PostsDatabase.TABLE_POST}.created_at`,
        `${PostsDatabase.TABLE_POST}.updated_at`,
        `${PostsDatabase.TABLE_USER}.name`,
        `${PostsDatabase.TABLE_USER}.email`,
        `${PostsDatabase.TABLE_USER}.password`,
        `${PostsDatabase.TABLE_USER}.role`
      )
      .join(
        PostsDatabase.TABLE_USER,
        `${PostsDatabase.TABLE_POST}.creator_id`,
        "=",
        `${PostsDatabase.TABLE_USER}.id`
      )
      .where(`${PostsDatabase.TABLE_POST}.id`, id);

    return result;
  };

  public updatePost = async (postDB: PostsDB): Promise<void> => {
    await BaseDatabase.connection(PostsDatabase.TABLE_POST)
      .update(postDB)
      .where({ id: postDB.id });
  };

  public findLikeDislike = async (
    likeDislikeDB: likeDislikePostDB
  ): Promise<POST_LIKE | undefined> => {
    const [result] = await BaseDatabase.connection(
      PostsDatabase.TABLE_LIKE_DISLIKE
    )
      .select()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });

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
  ): Promise<void> => {
    await BaseDatabase.connection(PostsDatabase.TABLE_LIKE_DISLIKE).insert(
      likeDislikeDB
    );
  };

  public removeLikeDislikePost = async (
    likeDislikeDB: likeDislikePostDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostsDatabase.TABLE_LIKE_DISLIKE)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  };

  public updateLikeDislikePost = async (
    likeDislikeDB: likeDislikePostDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostsDatabase.TABLE_LIKE_DISLIKE)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  };

  public deletePostById = async (id: string): Promise<void> => {
    await BaseDatabase.connection(PostsDatabase.TABLE_POST)
      .delete()
      .where({ id });
  };
}
