import { COMMENTARY_LIKE, CommentaryDB, CommentaryWithPostInfoDB, CommentaryWithUserInfoDB, likeDislikeCommentaryDB } from "../models/Commentary";
import { PostsDB } from "../models/Posts";
import { BaseDatabase } from "./BaseDatabase";

export class CommentaryDatabase extends BaseDatabase {
  static TABLE_USERS = "users";
  static TABLE_POSTS = "posts";
  static TABLE_COMMENTARY = "commentary";
  static LIKES_DISLIKES_TABLE = "like_dislike_commentary";

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

  public GetCommentaryWithCreatorInfoById = async (id: string): Promise<CommentaryWithUserInfoDB> => {
    const [result]: CommentaryWithUserInfoDB[] = await BaseDatabase.connection(CommentaryDatabase.TABLE_COMMENTARY)
    .select(    
      `${CommentaryDatabase.TABLE_COMMENTARY}.id`,
      `${CommentaryDatabase.TABLE_COMMENTARY}.creator_id`,
      `${CommentaryDatabase.TABLE_COMMENTARY}.post_id`,
      `${CommentaryDatabase.TABLE_COMMENTARY}.content`,
      `${CommentaryDatabase.TABLE_COMMENTARY}.like`,
      `${CommentaryDatabase.TABLE_COMMENTARY}.dislike`,
      `${CommentaryDatabase.TABLE_COMMENTARY}.created_at`,
      `${CommentaryDatabase.TABLE_USERS}.name`,
    )
    .join(
      CommentaryDatabase.TABLE_USERS,
      `${CommentaryDatabase.TABLE_COMMENTARY}.creator_id`,
      "=",
      `${CommentaryDatabase.TABLE_USERS}.id`
    )
    .where(`${CommentaryDatabase.TABLE_COMMENTARY}.id`, id)
    
    return result
  }

  public findLikeDislike = async (likeDislikeCommentaryDB: likeDislikeCommentaryDB): Promise<COMMENTARY_LIKE | undefined> => {
    const [result]: likeDislikeCommentaryDB[] | undefined = await BaseDatabase.connection(CommentaryDatabase.LIKES_DISLIKES_TABLE)
    .select()
    .where({
      user_id: likeDislikeCommentaryDB.user_id,
      commentary_id: likeDislikeCommentaryDB.commentary_id,
    })

    if(result === undefined) {
      return undefined
    } else if (result.like === 1){
      return COMMENTARY_LIKE.ALREADY_LIKED
    } else {
      return COMMENTARY_LIKE.ALREADY_DISLIKED
    }
  }

  public insertLikeDislike = async (likeDislikeCommentaryDB:likeDislikeCommentaryDB): Promise<void> => {
    await BaseDatabase.connection(CommentaryDatabase.LIKES_DISLIKES_TABLE)
    .insert(likeDislikeCommentaryDB)
  }

  public removeLikeDislike = async (likeDislikeCommentaryDB:likeDislikeCommentaryDB): Promise<void> => {
    await BaseDatabase.connection(CommentaryDatabase.LIKES_DISLIKES_TABLE)
    .delete()
    .where({      
      user_id: likeDislikeCommentaryDB.user_id,
      commentary_id: likeDislikeCommentaryDB.commentary_id
    })
  }

  public updateLikeDislike = async (likeDislikeCommentaryDB:likeDislikeCommentaryDB): Promise<void> => {
    await BaseDatabase.connection(CommentaryDatabase.LIKES_DISLIKES_TABLE)
    .update(likeDislikeCommentaryDB)
    .where({      
      user_id: likeDislikeCommentaryDB.user_id,
      commentary_id: likeDislikeCommentaryDB.commentary_id
    })
  }

  public updateCommentary = async (commentary : CommentaryDB): Promise<void> => {
    await BaseDatabase.connection(CommentaryDatabase.TABLE_COMMENTARY)
    .update(commentary)
    .where({id: commentary.id})
  }

  public updatePostCommentNumber = async (id: string): Promise<void> => {
    await BaseDatabase.connection(CommentaryDatabase.TABLE_POSTS)
    .where({id})
    .increment('comments', 1)
  }
}
