import { CommentaryBusiness } from "../../../src/business/CommentaryBusiness"
import { deleteCommentarySchema } from "../../../src/dtos/commentary/deleteCommentary.dto"
import { ForbiddenError } from "../../../src/errors/ForbidenError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { CommentaryDatabaseMock } from "../../mocks/CommentaryDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { ZodError } from "zod"

describe("Testando delete commentary", () => {
    const commentaryBusiness = new CommentaryBusiness(
        new CommentaryDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

        test("Retorna nada caso tenha deletado comentario com sucesso", async () => {
            const input = deleteCommentarySchema.parse({
                token: "token-mock-becca",
                id: "c001"
            })

            const output = await commentaryBusiness.deleteCommentaryById(input)

            expect(output).toBe(undefined)
        })

        test("Retorna erro caso token seja inválido", async () => {
            expect.assertions(2)
            try {
                const input = deleteCommentarySchema.parse({
                    token: "token-mock-error",
                    id: "c001"
                })

                await commentaryBusiness.deleteCommentaryById(input)
            } catch (error) {
                if(error instanceof UnauthorizedError){
                    expect(error.message).toBe("Token inválido")
                    expect(error.statusCode).toBe(401)
                }
            }
        })

        test("Retorna erro caso comentario não exista", async () => {
            expect.assertions(2)
            try {
                const input = deleteCommentarySchema.parse({
                    token: "token-mock-becca",
                    id: "c00erro"
                })

                await commentaryBusiness.deleteCommentaryById(input)
            } catch (error) {
                if(error instanceof NotFoundError){
                    expect(error.message).toBe("Comentario não existe")
                    expect(error.statusCode).toBe(404)
            
                }
            }
        })

        test("Retorna erro caso token não seja um admin e nem o criador do post", async () => {
            expect.assertions(1);
            try {
              const input = deleteCommentarySchema.parse({
                token: "token-mock-becca",
                id: "c002",
              });
        
              await commentaryBusiness.deleteCommentaryById(input);
            } catch (error) {
              if (error instanceof ForbiddenError) {
                expect(error.message).toBe(
                  "Somente quem criou o comentário pode apagar"
                );
              }
            }
          });

        test("Retorna erro caso token esteja vazio", async () => {
            expect.assertions(1)
            try {
                const input = deleteCommentarySchema.parse({
                    token: "",
                    id: "c001"
                })
            } catch (error) {
                if(error instanceof ZodError){
                    expect(error.issues[0].message).toBe("String must contain at least 1 character(s)")
                }
            }
        })

        test("Retorna erro caso id esteja vazio", () => {
            expect.assertions(1)
            try {
                const input = deleteCommentarySchema.parse({
                    token: "token-mock-becca",
                    id: ""
                })
            } catch (error) {
                if(error instanceof ZodError){
                    expect(error.issues[0].message).toBe("'id' deve possuir no mínimo 1 caractere")
                }
            }
        })
 })