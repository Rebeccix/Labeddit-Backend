import { CommentaryBusiness } from "../../../src/business/CommentaryBusiness";
import { likeDislikeCommentaryScheama } from "../../../src/dtos/commentary/likeDislikeCommentary.dto";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { CommentaryDatabaseMock } from "../../mocks/CommentaryDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { ZodError } from "zod";

describe("Testando likeDislikeCommentary", () => {
  const commentaryBusiness = new CommentaryBusiness(
    new CommentaryDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Teste relacionado ao likeDislike como True", async () => {
    const input = likeDislikeCommentaryScheama.parse({
      token: "token-mock-becca",
      idCommentaryToLikeDislike: "c001",
      likeOrDislike: true,
    });
    const output = await commentaryBusiness.likeDislikeCommentary(input);

    expect(output).toBe(undefined);
  });

  test("Teste relacionado ao likeDislike como False", async () => {
    const input = likeDislikeCommentaryScheama.parse({
      token: "token-mock-becca",
      idCommentaryToLikeDislike: "c001",
      likeOrDislike: false,
    });
    const output = await commentaryBusiness.likeDislikeCommentary(input);

    expect(output).toBe(undefined);
  });

  test("Teste relacionado ao likeDislike como False e o comentario não sendo liked", async () => {
    const input = likeDislikeCommentaryScheama.parse({
      token: "token-mock-becca",
      idCommentaryToLikeDislike: "c002",
      likeOrDislike: false,
    });
    const output = await commentaryBusiness.likeDislikeCommentary(input);

    expect(output).toBe(undefined);
  });

  test("Teste false relacionado ao likeDislike com commentario que não foi liked e nem disliked", async () => {
    const input = likeDislikeCommentaryScheama.parse({
      token: "token-mock-becca",
      idCommentaryToLikeDislike: "c002",
      likeOrDislike: true,
    });
    const output = await commentaryBusiness.likeDislikeCommentary(input);

    expect(output).toBe(undefined);
  });

  test("Teste true relacionado ao likeDislike com commentario que não foi liked e nem disliked", async () => {
    const input = likeDislikeCommentaryScheama.parse({
      token: "token-mock-becca",
      idCommentaryToLikeDislike: "c003",
      likeOrDislike: true,
    });
    const output = await commentaryBusiness.likeDislikeCommentary(input);

    expect(output).toBe(undefined);
  });

  test("Teste false relacionado ao likeDislike com commentario que não foi liked e nem disliked", async () => {
    const input = likeDislikeCommentaryScheama.parse({
      token: "token-mock-becca",
      idCommentaryToLikeDislike: "c003",
      likeOrDislike: false,
    });
    const output = await commentaryBusiness.likeDislikeCommentary(input);

    expect(output).toBe(undefined);
  });

  test("Retorna erro caso comentario não exista", async () => {
    expect.assertions(2);
    try {
      const input = likeDislikeCommentaryScheama.parse({
        token: "token-mock-becca",
        idCommentaryToLikeDislike: "c00Error",
        likeOrDislike: true,
      });
      await commentaryBusiness.likeDislikeCommentary(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("Comentario não existe");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("Retorna erro caso token esteja vazio", async () => {
    expect.assertions(1);
    try {
      const input = likeDislikeCommentaryScheama.parse({
        token: "",
        idCommentaryToLikeDislike: "c001",
        likeOrDislike: true,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 1 character(s)"
        );
      }
    }
  });

  test("Retorna erro caso idCommentaryToLikeDislike esteja vazio", async () => {
    expect.assertions(1);
    try {
      const input = likeDislikeCommentaryScheama.parse({
        token: "token-mock-becca",
        idCommentaryToLikeDislike: "",
        likeOrDislike: true,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "'id' deve possuir no mínimo 1 caractere"
        );
      }
    }
  });

  test("Retorna erro caso likeOrDislike não seja um boolean", async () => {
    expect.assertions(1);
    try {
      const input = likeDislikeCommentaryScheama.parse({
        token: "token-mock-becca",
        idCommentaryToLikeDislike: "c001",
        likeOrDislike: "true",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "Expected boolean, received string"
        );
      }
    }
  });

  test("Retorna erro caso token seja inválido", async () => {
    expect.assertions(2);
    try {
      const input = likeDislikeCommentaryScheama.parse({
        token: "error",
        idCommentaryToLikeDislike: "c001",
        likeOrDislike: true,
      });
      await commentaryBusiness.likeDislikeCommentary(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe(
          "Token inválido"
        )
        expect(error.statusCode).toBe(401)
      }
    }
  });
});
