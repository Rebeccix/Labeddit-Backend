import { UserBusiness } from "../../../src/business/UserBusiness"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import { HashManagerMock } from "../../mocks/HashManagerMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { SignupSchema } from "../../../src/dtos/user/signup.dto"


describe("Testando Signup", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    
    test("deve gerar token ao cadatrar", async () => {
        const input = SignupSchema.parse({
            name: "fulano",
            email: "fulano@gmail.com",
            password: "fulano123"
        })

        const output = await userBusiness.signup(input)

        expect(output).toEqual({
            token: "token-mock"
        })
    })
})