import { CommentaryDatabase } from "../database/CommentaryDatabase";
import {
  CreateCommentaryPostInputDTO,
  CreateCommentaryPostOutputDTO,
} from "../dtos/commentary/createCommentary.dto";
import { deleteCommentaryInput, deleteCommentaryOutput } from "../dtos/commentary/deleteCommentary.dto";
import {
  GetCommentaryByIdInputDTO,
  GetCommentaryByIdOutputDTO,
} from "../dtos/commentary/getCommentaryById.dto";
import {
  likeDislikeCommentaryInputDTO,
  likeDislikeCommentaryOutputDTO,
} from "../dtos/commentary/likeDislikeCommentary.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ForbiddenError } from "../errors/ForbidenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import {
  COMMENTARY_LIKE,
  Commentary,
  CommentaryDB,
  likeDislikeCommentaryDB,
} from "../models/Commentary";
import { PostsWithCreatorNameModel } from "../models/Posts";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class CommentaryBusiness {
  constructor(
    private commentaryDatabase: CommentaryDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public createCommentary = async (
    input: CreateCommentaryPostInputDTO
  ): Promise<CreateCommentaryPostOutputDTO> => {
    const { token, id, content } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postFound = await this.commentaryDatabase.findPostById(id);

    if (!postFound) {
      throw new BadRequestError();
    }

    const idCommentary = this.idGenerator.generate();

    const commentaryDB: CommentaryDB = new Commentary(
      idCommentary,
      payload.id,
      postFound.id,
      content,
      0,
      0,
      new Date().toISOString()
    ).toCommentaryDB();

    await this.commentaryDatabase.insertCommentary(commentaryDB);
    await this.commentaryDatabase.incrementPostCommentNumber(postFound.id);

    const output: undefined = undefined;

    return output;
  };

  public getCommentaryById = async (
    input: GetCommentaryByIdInputDTO
  ): Promise<GetCommentaryByIdOutputDTO> => {
    const { token, id } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postWithCommentarysDB =
      await this.commentaryDatabase.findPostAndCommentaryById(id);

    const postWithCommentaryInstanced = postWithCommentarysDB.map((data) => {
      const postCreator: PostsWithCreatorNameModel = {
        id: data.id,
        name: data.creator_name,
        content: data.content,
        like: data.like,
        dislike: data.dislike,
        comments: data.comments,
      };

      const CommentaryWithPostCreator = new Commentary(
        data.id_commentary,
        data.creator_id,
        data.id,
        data.content_commentary,
        data.like_commentary,
        data.dislike_commentary,
        new Date().toISOString(),
        data.commentary_creator_name,
        postCreator
      );

      return CommentaryWithPostCreator;
    });

    const output: GetCommentaryByIdOutputDTO =
      postWithCommentaryInstanced[0].getId() === undefined
        ? {
            id: postWithCommentaryInstanced[0].getPostCreator()?.id,
            creatorName: postWithCommentaryInstanced[0].getPostCreator()?.name,
            content: postWithCommentaryInstanced[0].getPostCreator()?.content,
            like: postWithCommentaryInstanced[0].getPostCreator()?.like,
            dislike: postWithCommentaryInstanced[0].getPostCreator()?.dislike,
            comments: postWithCommentaryInstanced[0].getPostCreator()?.comments,
            commentaries: [],
          }
        : {
            id: postWithCommentaryInstanced[0].getPostCreator()?.id,
            creatorName: postWithCommentaryInstanced[0].getPostCreator()?.name,
            content: postWithCommentaryInstanced[0].getPostCreator()?.content,
            like: postWithCommentaryInstanced[0].getPostCreator()?.like,
            dislike: postWithCommentaryInstanced[0].getPostCreator()?.dislike,
            comments: postWithCommentaryInstanced[0].getPostCreator()?.comments,
            commentaries: postWithCommentaryInstanced.map((commentary) => ({
              idCommentary: commentary.getId(),
              creatorId: commentary.getCreatorId(),
              creatorName: commentary.getCommentaryCreator(),
              contentCommentary: commentary.getContent(),
              likeCommentary: commentary.getLike(),
              dislikeCommentary: commentary.getDislike(),
            })),
          };      
  
    return output;
  };

  public likeDislikeCommentary = async (
    input: likeDislikeCommentaryInputDTO
  ): Promise<likeDislikeCommentaryOutputDTO> => {
    const { token, idCommentaryToLikeDislike, likeOrDislike } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentaryDB =
      await this.commentaryDatabase.GetCommentaryWithCreatorInfoById(
        idCommentaryToLikeDislike
      );

    if (!commentaryDB) {
      throw new NotFoundError("Comentario não existe");
    }

    const commentary = new Commentary(
      commentaryDB.id,
      commentaryDB.creator_id,
      commentaryDB.post_id,
      commentaryDB.content,
      commentaryDB.like,
      commentaryDB.dislike,
      commentaryDB.created_at,
      commentaryDB.name
    );

    const like = likeOrDislike ? 1 : 0;

    const likeDislikeCommentaryDB: likeDislikeCommentaryDB = {
      user_id: payload.id,
      commentary_id: commentaryDB.id,
      like: like,
    };

    const likeDislikeExist = await this.commentaryDatabase.findLikeDislike(
      likeDislikeCommentaryDB
    );

    if (likeDislikeExist === COMMENTARY_LIKE.ALREADY_LIKED) {
      if (likeOrDislike) {
        await this.commentaryDatabase.removeLikeDislike(
          likeDislikeCommentaryDB
        );
        commentary.removeLike();
      } else {
        await this.commentaryDatabase.updateLikeDislike(
          likeDislikeCommentaryDB
        );
        commentary.removeLike();
        commentary.addDislike();
      }
    } else if (likeDislikeExist === COMMENTARY_LIKE.ALREADY_DISLIKED) {
      if (!likeOrDislike) {
        await this.commentaryDatabase.removeLikeDislike(
          likeDislikeCommentaryDB
        );
        commentary.removeDislike();
      } else {
        await this.commentaryDatabase.updateLikeDislike(
          likeDislikeCommentaryDB
        );
        commentary.removeDislike();
        commentary.addLike();
      }
    } else {
      await this.commentaryDatabase.insertLikeDislike(likeDislikeCommentaryDB);
      likeOrDislike ? commentary.addLike() : commentary.addDislike();
    }

    const updatedCommentaryDB = commentary.toCommentaryDB();
    await this.commentaryDatabase.updateCommentary(updatedCommentaryDB);

    const output = undefined;

    return output;
  };

  public deleteCommentaryById = async (input: deleteCommentaryInput): Promise<deleteCommentaryOutput> => {
    
    const { token, id } = input

    const payload = this.tokenManager.getPayload(token)

    if(!payload){
      throw new UnauthorizedError()
    }

    const commentaryExist = await this.commentaryDatabase.findCommentaryById(id)

    if (!commentaryExist) {
      throw new NotFoundError("Comentario não existe");
    }

  if (payload.role !== USER_ROLES.ADMIN) {
    if (commentaryExist.creator_id !== payload.id) {
      throw new ForbiddenError("Somente quem criou o comentário pode apagar");
    }
  }

    await this.commentaryDatabase.deleteCommentary(commentaryExist.id)
    await this.commentaryDatabase.decrementPostCommentNumber(commentaryExist.post_id)

    const output = undefined

    return output
  }
}
