import { ZodError } from "zod";
import { CommentaryBusiness } from "../../../src/business/CommentaryBusiness";
import { GetCommentaryByIdScheama } from "../../../src/dtos/commentary/getCommentaryById.dto";
import { CommentaryDatabaseMock } from "../../mocks/CommentaryDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";

describe("Testando CreateCommentary", () => {
  const commentaryBusiness = new CommentaryBusiness(
    new CommentaryDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Retorna o post pelo id com comentarios", async () => {
    const input = GetCommentaryByIdScheama.parse({
      token: "token-mock-becca",
      id: "p001",
    });

    const output = await commentaryBusiness.getCommentaryById(input);

    expect(output).toEqual({
      id: "p001",
      creatorName: "becca",
      content: "Post test um",
      like: 2,
      dislike: 0,
      comments: 5,
      commentaries: [
        {
          idCommentary: "c001",
          creatorId: "id-mock-becca",
          creatorName: "becca",
          contentCommentary: "content test",
          likeCommentary: 1,
          dislikeCommentary: 4,
        },
      ],
    });
  });

  test("Retorna o post pelo id com comentario vazio", async () => {
    const input = GetCommentaryByIdScheama.parse({
      token: "token-mock-becca",
      id: "p003",
    });

    const output = await commentaryBusiness.getCommentaryById(input);

    expect(output).toEqual({
      id: "p003",
      creatorName: "becca",
      content: "Post test tres sem comentario",
      like: 10,
      dislike: 20,
      comments: 50,
      commentaries: [],
    });
  });

  test("Retorna erro caso token esteja vazio", async () => {
    expect.assertions(1);
    try {
      const input = GetCommentaryByIdScheama.parse({
        token: "",
        id: "p001",
      });
    } catch (error) {
      if (error instanceof ZodError)
        expect(error.issues[0].message).toBe(
          "String must contain at least 1 character(s)"
        );
    }
  });

  test("Retorna erro caso id esteja vazio", async () => {
    expect.assertions(1);
    try {
      const input = GetCommentaryByIdScheama.parse({
        token: "token-mock-becca",
        id: "",
      });
    } catch (error) {
      if (error instanceof ZodError)
        expect(error.issues[0].message).toBe(
          "'id' deve possuir no mínimo 1 caractere"
        );
    }
  });

  test("Retorna erro caso token seja invalido", async () => {
    expect.assertions(2);
    try {
      const input = GetCommentaryByIdScheama.parse({
        token: "token-mock-error",
        id: "p001",
      });
      await commentaryBusiness.getCommentaryById(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido");
        expect(error.statusCode).toBe(401);
      }
    }
  });
});
