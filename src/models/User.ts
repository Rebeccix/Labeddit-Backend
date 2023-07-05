export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
} 

export interface TokenPayload {
    id: string,
    name: string,
    role: USER_ROLES
} 

export interface UserDB {
    id: string,
    name: string, 
    email: string,
    password: string,
    role: USER_ROLES,
    created_at: string   
}

export interface UserModel {
    id: string,
    name: string, 
    email: string,
    role: USER_ROLES,
    createdAt: string   
}

export class User {
    constructor(
        private id: string,
        private name: string,
        private email: string,
        private password: string,
        private role: USER_ROLES,
        private createdAt: string
    ) {}

    public toUserDBModel(): UserDB {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role,
            created_at: this.createdAt
        }
    }

    public getId = (): string => this.id
    
    public getName = (): string => this.name

    public getRole = (): USER_ROLES => this.role

    public getPassword = (): string => this.password
}