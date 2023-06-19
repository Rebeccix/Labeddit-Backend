import { PostsDatabase } from "../database/PostsDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/posts/createPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/posts/getPosts.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ConflictError } from "../errors/ConflictError";
import { Posts } from "../models/Posts";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostsBusiness {
    constructor(
        private postsDatabase: PostsDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
    ){}

    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {
        const { token, content } = input

        const payload = this.tokenManager.getPayload(token)
        
        if(!payload) {
            throw new BadRequestError("token inválido")
        } 

        const id = this.idGenerator.generate()

        const postDB = new Posts(
            id,
            payload.id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.name
        )

        const postToInsert = postDB.toPostsDB()

        const isDuplicate = await this.postsDatabase.findPostByCreatorId(payload.id)
            
        if(isDuplicate) {
            if(isDuplicate.filter(data => data.content === postToInsert.content).length !== 0) {
                throw  new ConflictError("Você já criou um post com esse contéudo.")
            } 
        }
        
        await this.postsDatabase.insertPost(postToInsert)
    
        const output: CreatePostOutputDTO = undefined

        return output
    }
    
    public getPosts = async (input: GetPostsInputDTO) => {
        const { token } = input

        const payload = this.tokenManager.getPayload(token)
        
        if(!payload) { 
            throw new BadRequestError("Token inválido")
        }

        const postsDB = await this.postsDatabase.getPostsWithCreatorName()  

        const postModel = postsDB.map(data => {
            return new Posts (
                data.id,
                data.creator_id,
                data.content,
                data.like,
                data.comments,
                data.created_at,
                data.updated_at,
                data.name
            ).toPostsModelWithNameModel()
        })
        
        const output = postModel
        
        return output
    }
}