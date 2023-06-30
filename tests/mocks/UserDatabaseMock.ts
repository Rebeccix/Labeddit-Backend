import { UserDB, USER_ROLES } from "../../src/models/User";
import { BaseDatabase } from "../../src/database/BaseDatabase";

const usersMock: UserDB[] = [
  {
    id: "id-mock-becca",
    name: "becca",
    email: "becca@gmail.com",
    password: "hash-mock-becca",
    role: USER_ROLES.NORMAL,
    created_at: new Date().toISOString(),
  },
  {
    id: "id-mock-admin",
    name: "admin",
    email: "admin@gmail.com",
    password: "hash-mock-admin",
    role: USER_ROLES.ADMIN,
    created_at: new Date().toISOString(),
  },
];

export class UserDatabaseMock extends BaseDatabase {
  public static TABLE_USER = "users";

  public insertUser = async (UserDB: UserDB): Promise<void> => {

  };

  public findUserByEmail = async (email: string): Promise<UserDB> => {
    return usersMock.filter(user => user.email === email)[0]
  };
}
