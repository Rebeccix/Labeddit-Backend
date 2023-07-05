import { ZodError } from "zod"
import { PostsBusiness } from "../../../src/business/PostsBusiness"
import { CreatePostSchema } from "../../../src/dtos/posts/createPost.dto"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { PostsDatabaseMock } from "../../mocks/PostsDatabaseMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { ConflictError } from "../../../src/errors/ConflictError"

describe("Testando CreatePost", () => {
    const postsBusiness = new PostsBusiness(
        new PostsDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("Retorna undefined ao criar um novo post", async () => {
        expect.assertions(1)
        const input = CreatePostSchema.parse({
            token: "token-mock-becca",
            content: "Post test"
        })

        const output = await postsBusiness.createPost(input)

        expect(output).toBe(undefined)
    })

    test("Retorna um erro caso payload esteja inválido", async () => {
        expect.assertions(2)
        try {
            const input = CreatePostSchema.parse({
                token: "token-mock-error",
                content: "Post test"
            })
    
            await postsBusiness.createPost(input)
        } catch (error) {
            if(error instanceof UnauthorizedError){
                expect(error.message).toBe("token inválido")
                expect(error.statusCode).toBe(401)
            }
        }
    })

    test("Retorna um erro caso post já exista", async () => {
        expect.assertions(2)
        try {
            const input = CreatePostSchema.parse({
                token: "token-mock-becca",
                content: "Post test um"
            })
    
            await postsBusiness.createPost(input)
        } catch (error) {
            if(error instanceof ConflictError){
                expect(error.message).toBe("Você já criou um post com esse contéudo.")
                expect(error.statusCode).toBe(409)
            }
        }
    })

    test("Retorna erro caso token esteja vazio", async () => {
        expect.assertions(1)
        try {
            const input = CreatePostSchema.parse({
                token: "",
                content: "Post test"
            })
        } catch (error) {
            if(error instanceof ZodError){
                expect(error.issues[0].message).toBe("String must contain at least 1 character(s)")
            }
        }
    })

    test("Retorna erro caso content esteja vazio", async () => {
        expect.assertions(1)
        try {
            const input = CreatePostSchema.parse({
                token: "token-mock-becca",
                content: ""
            })
        } catch (error) {
            if(error instanceof ZodError){
                expect(error.issues[0].message).toBe("String must contain at least 1 character(s)")
            }
        }
    })
})