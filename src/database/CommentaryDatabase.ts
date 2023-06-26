import { CommentaryDB, CommentaryWithPostInfoDB } from "../models/Commentary";
import { PostsDB } from "../models/Posts";
import { BaseDatabase } from "./BaseDatabase";

export class CommentaryDatabase extends BaseDatabase {
  static TABLE_USERS = "users";
  static TABLE_POSTS = "posts";
  static TABLE_COMMENTARY = "commentary";

  public findPostById = async (id: string): Promise<PostsDB | undefined> => {
    const [result]: PostsDB[] | undefined = await BaseDatabase.connection(
      CommentaryDatabase.TABLE_POSTS
    ).where({ id });

    return result;
  };

  public insertCommentary = async (
    commentaryDB: CommentaryDB
  ): Promise<void> => {
    await BaseDatabase.connection(CommentaryDatabase.TABLE_COMMENTARY).insert(
      commentaryDB
    );
  };

  public findPostAndCommentaryById = async (id: string): Promise<CommentaryWithPostInfoDB[]> => {
    const result: CommentaryWithPostInfoDB[]  = await BaseDatabase.connection(CommentaryDatabase.TABLE_POSTS)
      .select(
        `${CommentaryDatabase.TABLE_POSTS}.id`,
        `${CommentaryDatabase.TABLE_USERS}.name as creator_name`,
        `${CommentaryDatabase.TABLE_POSTS}.content`,
        `${CommentaryDatabase.TABLE_POSTS}.like`,
        `${CommentaryDatabase.TABLE_POSTS}.dislike`,
        `${CommentaryDatabase.TABLE_POSTS}.comments`,
        `${CommentaryDatabase.TABLE_COMMENTARY}.id as id_commentary `,
        `${CommentaryDatabase.TABLE_COMMENTARY}.creator_id as creator_id `,
        `${CommentaryDatabase.TABLE_USERS}_${CommentaryDatabase.TABLE_COMMENTARY}.name as commentary_creator_name`,
        `${CommentaryDatabase.TABLE_COMMENTARY}.content as content_commentary`,
        `${CommentaryDatabase.TABLE_COMMENTARY}.like as like_commentary`,
        `${CommentaryDatabase.TABLE_COMMENTARY}.dislike as dislike_commentary`
      )
      .join(
        CommentaryDatabase.TABLE_USERS,
        `${CommentaryDatabase.TABLE_POSTS}.creator_id`,
        `${CommentaryDatabase.TABLE_USERS}.id`
      )
      .join(
        CommentaryDatabase.TABLE_COMMENTARY,
        `${CommentaryDatabase.TABLE_POSTS}.id`,
        `${CommentaryDatabase.TABLE_COMMENTARY}.post_id`
      )
      .join(
        `${CommentaryDatabase.TABLE_USERS} as ${CommentaryDatabase.TABLE_USERS}_${CommentaryDatabase.TABLE_COMMENTARY}`,
        `${CommentaryDatabase.TABLE_COMMENTARY}.creator_id`,
        `${CommentaryDatabase.TABLE_USERS}_${CommentaryDatabase.TABLE_COMMENTARY}.id`
      )
      .where(`${CommentaryDatabase.TABLE_POSTS}.id`, id);
        
        if(result.length === 0) {
          return await BaseDatabase.connection(CommentaryDatabase.TABLE_POSTS)
          .select(        
          `${CommentaryDatabase.TABLE_POSTS}.id`,
          `${CommentaryDatabase.TABLE_USERS}.name as creator_name`,
          `${CommentaryDatabase.TABLE_POSTS}.content`,
          `${CommentaryDatabase.TABLE_POSTS}.like`,
          `${CommentaryDatabase.TABLE_POSTS}.dislike`,
          `${CommentaryDatabase.TABLE_POSTS}.comments`)
          .join(
            CommentaryDatabase.TABLE_USERS,
            `${CommentaryDatabase.TABLE_POSTS}.creator_id`,
            `${CommentaryDatabase.TABLE_USERS}.id`
          )
          .where(`${CommentaryDatabase.TABLE_POSTS}.id`, id);
        } else {
          return result
        }
  };
}
