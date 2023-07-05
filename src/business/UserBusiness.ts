import { UserDatabase } from "../database/UserDatabase";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/user/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/user/signup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { TokenPayload, USER_ROLES, User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
        ){}

        public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
            const { name, email, password } = input

            const id = this.idGenerator.generate()

            const hashedPassword = await this.hashManager.hash(password)

            const user = new User(
                id,
                name,
                email,
                hashedPassword,
                USER_ROLES.NORMAL,
                new Date().toISOString()
            )

            const userDB = user.toUserDBModel()

            const userDBFound = await this.userDatabase.findUserByEmail(email)

            if(userDBFound !== undefined && userDBFound.email === email) {
                throw new BadRequestError("Email já existe")
            }

            await this.userDatabase.insertUser(userDB)

            const payload: TokenPayload = {
                id: user.getId(),
                name: user.getName(),
                role: user.getRole()
            }

            const token = this.tokenManager.createToken(payload)
 
            const output: SignupOutputDTO = { 
                token
            }

            return output
        }
    
        public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
            const { email, password } = input

            const userDBFound = await this.userDatabase.findUserByEmail(email)

            if(!userDBFound) {
                throw new BadRequestError("E-mail e/ou Senha inválido(s).")
            }

            const userDB = new User(
                userDBFound.id,
                userDBFound.name,
                userDBFound.email,
                userDBFound.password,
                userDBFound.role,
                userDBFound.created_at
            )

            const hashedPassword = userDB.getPassword()

            const isIncorrectPassword = await this.hashManager.compare(password, hashedPassword)

            if(!isIncorrectPassword) {
                throw new BadRequestError("E-mail e/ou Senha inválido(s).")
            }

            const payload: TokenPayload = {
                id: userDB.getId(),
                name: userDB.getName(),
                role: userDB.getRole()
            }

            const token = this.tokenManager.createToken(payload)
 
            const output: LoginOutputDTO = { 
                token
            }

            return output
        }
}