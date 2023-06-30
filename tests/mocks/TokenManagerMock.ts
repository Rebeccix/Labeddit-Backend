import { TokenPayload, USER_ROLES } from "../../src/models/User"

export class TokenManagerMock {
    public createToken = (payload: TokenPayload): string => {
        if(payload.id === "id-mock"){
            return "token-mock"
        } else if (payload.id === "hash-mock-becca") {
            return "token-mock-becca"
        } else {
            return "token-mock-admin"
        }
    }

    public getPayload = (token: string): TokenPayload | null => {
        if (token === "token-mock-becca") {
            return {
                id: "id-mock-becca",
                name: "becca",
                role: USER_ROLES.NORMAL
            }
        } else if (token === "token-mock-admin") {
            return { 
                id: "id-mock-admin",
                name: "admin",
                role: USER_ROLES.ADMIN
            }
        } else {
            return null
        }
    }
}