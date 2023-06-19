import { CommentaryDatabase } from "../database/CommentaryDatabase";
import {
  CreateCommentaryPostInputDTO,
  CreateCommentaryPostOutputDTO,
} from "../dtos/commentary/createCommentary.dto";
import { GetCommentaryByIdInputDTO, GetCommentaryByIdOutputDTO } from "../dtos/commentary/getCommentaryById.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import {
  Commentary,
  CommentaryDB,
  PostWihCommentModel,
  PostWithCommentsDB,
} from "../models/Commentary";
import { PostsWithCreatorNameModel } from "../models/Posts";
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
      new Date().toISOString()
    ).toCommentaryDB();

    await this.commentaryDatabase.insertCommentary(commentaryDB);

    const output: undefined = undefined;

    return output;
  };

  public getCommentaryById = async (input: GetCommentaryByIdInputDTO) => {
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
        comments: data.comments,
      };

      const CommentaryWithPostCreator = new Commentary(
        data.id_commentary,
        data.creator_id,
        data.id,
        data.content_commentary,
        data.like_commentary,
        new Date().toISOString(),
        data.commentary_creator_name,
        postCreator,
      );

      return CommentaryWithPostCreator;
    });

    let postWithCommentaryModel: PostWihCommentModel = {
      id: postWithCommentaryInstanced[0].getPostCreator()?.id,
      creatorName: postWithCommentaryInstanced[0].getPostCreator()?.name,
      content: postWithCommentaryInstanced[0].getPostCreator()?.content,
      like: postWithCommentaryInstanced[0].getPostCreator()?.like,
      comments: postWithCommentaryInstanced[0].getPostCreator()?.comments,
      commentaries: postWithCommentaryInstanced.map((data) => ({
        idCommentary: data.getId(),
        creatorId: data.getCreatorId(),
        commentaryCreatorName: data.getCommentaryCreator(),
        contentCommentary: data.getContent(),
        likeCommentary: data.getLike(),
      })),
    };
    
    if (!postWithCommentaryModel.commentaries[0].idCommentary) {
      postWithCommentaryModel = {
        ...postWithCommentaryModel,
        commentaries: []
    }
  }

    const output: GetCommentaryByIdOutputDTO = postWithCommentaryModel

    return output
  };
}
