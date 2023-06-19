import { PostsDB, PostsWithCreatorNameDB } from "../models/Posts";
import { BaseDatabase } from "./BaseDatabase";

export class PostsDatabase extends BaseDatabase{
    public static TABLE_POST = "posts"
    public static TABLE_USER = "users"

    public insertPost = async (postDB: PostsDB): Promise<void> => {
        await BaseDatabase.connection(PostsDatabase.TABLE_POST).insert(postDB)
    }

    public findPostByCreatorId = async (creatorId: string): Promise<PostsDB[]> => {
        const result: Array<PostsDB> | undefined = await BaseDatabase.connection(PostsDatabase.TABLE_POST).where('creator_id', creatorId) 

        return result 
    }

    public getPostsWithCreatorName = async (): Promise<PostsWithCreatorNameDB[]> => {
        const result: PostsWithCreatorNameDB[] = await BaseDatabase.connection(PostsDatabase.TABLE_POST)
        .select(
            `${PostsDatabase.TABLE_POST}.id`,
            `${PostsDatabase.TABLE_POST}.creator_id`,
            `${PostsDatabase.TABLE_POST}.content`,
            `${PostsDatabase.TABLE_POST}.like`,
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
            '=',
            `${PostsDatabase.TABLE_USER}.id`
            )
            
            return result
    }
} 