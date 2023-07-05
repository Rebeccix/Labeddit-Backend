import { UserDB } from "../models/User"
import { BaseDatabase } from "./BaseDatabase"

export class UserDatabase extends BaseDatabase {
    public static TABLE_USER = "users"

    public insertUser = async (UserDB: UserDB): Promise<void> => {
        await BaseDatabase.connection(UserDatabase.TABLE_USER).insert(UserDB)
    }

    public findUserByEmail = async (email: string): Promise<UserDB | undefined> => {
        const [result]: UserDB[] | undefined =  await BaseDatabase.connection(UserDatabase.TABLE_USER).where({email})

        return result
    }
}