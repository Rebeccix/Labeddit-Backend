import { PostsDatabase } from "../database/PostsDatabase";
import {
  CreatePostInputDTO,
  CreatePostOutputDTO,
} from "../dtos/posts/createPost.dto";
import {
  GetPostsInputDTO,
  GetPostsOutputDTO,
} from "../dtos/posts/getPosts.dto";
import { likeDislikePostInputDTO, likeDislikePostOutputDTO } from "../dtos/posts/likeDislike.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ConflictError } from "../errors/ConflictError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { POST_LIKE, Posts, likeDislikePostDB } from "../models/Posts";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostsBusiness {
  constructor(
    private postsDatabase: PostsDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) { }

  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    const { token, content } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("token inválido");
    }

    const id = this.idGenerator.generate();

    const postDB = new Posts(
      id,
      payload.id,
      content,
      0,
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString(),
      payload.name
    );

    const postToInsert = postDB.toPostsDB();

    const isDuplicate = await this.postsDatabase.findPostByCreatorId(
      payload.id
    );

    if (isDuplicate) {
      if (
        isDuplicate.filter((data) => data.content === postToInsert.content)
          .length !== 0
      ) {
        throw new ConflictError("Você já criou um post com esse contéudo.");
      }
    }

    await this.postsDatabase.insertPost(postToInsert);

    const output: CreatePostOutputDTO = undefined;

    return output;
  };

  public getPosts = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO[]> => {
    const { token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Token inválido");
    }

    const postsDB = await this.postsDatabase.getPostsWithCreatorName();

    const postModel = postsDB.map((data) => {
      return new Posts(
        data.id,
        data.creator_id,
        data.content,
        data.like,
        data.dislike,
        data.comments,
        data.created_at,
        data.updated_at,
        data.name
      ).toPostsModelWithNameModel();
    });

    const output: GetPostsOutputDTO[] = postModel;

    return output;
  };

  public likeDislikePost = async (input: likeDislikePostInputDTO): Promise<likeDislikePostOutputDTO> => {
    const { token, idToLikeDislike, like } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Token inválido");
    }

    const postDB = await this.postsDatabase.getPostWithCreatorNameById(
      idToLikeDislike
    );

    if (!postDB) {
      throw new BadRequestError("Post não existe");
    }

    const post = new Posts(
      postDB.id,
      postDB.creator_id,
      postDB.content,
      postDB.like,
      postDB.dislike,
      postDB.comments,
      postDB.created_at,
      postDB.updated_at,
      postDB.name
    );

    const likedOrDisliked = like ? 1 : 0;

    const likeDislikeDB: likeDislikePostDB = {
      user_id: payload.id,
      post_id: postDB.id,
      like: likedOrDisliked,
    };

    const checkLikeInPost = await this.postsDatabase.findLikeDislike(
      likeDislikeDB
    );

    if (checkLikeInPost === POST_LIKE.ALREADY_LIKED) {
      if (likedOrDisliked) {
        await this.postsDatabase.removeLikeDislikePost(likeDislikeDB);
        post.removeLike();
      } else {
        await this.postsDatabase.updateLikeDislikePost(likeDislikeDB);
        post.removeLike();
        post.addDislike();
      }
    } else if (checkLikeInPost === POST_LIKE.ALREADY_DISLIKED) {
      if (!likedOrDisliked) {
        await this.postsDatabase.removeLikeDislikePost(likeDislikeDB);
        post.removeDislike();
      } else {
        await this.postsDatabase.updateLikeDislikePost(likeDislikeDB);
        post.removeDislike();
        post.addLike();
      }
    } else {
      await this.postsDatabase.insertLikeDislikePost(likeDislikeDB);
      likedOrDisliked ? post.addLike() : post.addDislike();
    }

    const updatedPostDB = post.toPostsDB();
    await this.postsDatabase.updatePost(updatedPostDB);

    const output: likeDislikePostOutputDTO = undefined

    return output
  };
}
