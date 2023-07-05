import { ZodError } from "zod";
import { CommentaryBusiness } from "../../../src/business/CommentaryBusiness";
import { CreateCommentaryPostScheama } from "../../../src/dtos/commentary/createCommentary.dto";
import { CommentaryDatabaseMock } from "../../mocks/CommentaryDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { BadRequestError } from "../../../src/errors/BadRequestError";

describe("Testando CreateCommentary", () => {
  const commentaryBusiness = new CommentaryBusiness(
    new CommentaryDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Retorna undefined ao criar um comentario", async () => {
    const input = CreateCommentaryPostScheama.parse({
      token: "token-mock-becca",
      id: "p001",
      content: "comentario teste um",
    });

    const output = await commentaryBusiness.createCommentary(input);

    expect(output).toBe(undefined);
  });

  test("Retorna erro caso token seja vazio", async () => {
    expect.assertions(1);
    try {
      const input = CreateCommentaryPostScheama.parse({
        token: "",
        id: "p001",
        content: "comentario teste um",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 1 character(s)"
        );
      }
    }
  });

  test("Retorna erro caso id seja vazio", async () => {
    expect.assertions(1);
    try {
      const input = CreateCommentaryPostScheama.parse({
        token: "token-mock-becca",
        id: "",
        content: "comentario teste um",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 1 character(s)"
        );
      }
    }
  });

  test("Retorna erro caso content seja vazio", async () => {
    expect.assertions(1);
    try {
      const input = CreateCommentaryPostScheama.parse({
        token: "token-mock-becca",
        id: "p001",
        content: "",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 1 character(s)"
        );
      }
    }
  });

  test("Retorna erro caso token seja inválido", async () => {
    expect.assertions(2);
    try {
      const input = CreateCommentaryPostScheama.parse({
        token: "tokenError",
        id: "p001",
        content: "comentario teste um",
      });

      await commentaryBusiness.createCommentary(input)
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido");
        expect(error.statusCode).toBe(401);
      }
    }
  });

  test("Retorna erro caso id não exista", async () => {
    expect.assertions(2);
    try {
      const input = CreateCommentaryPostScheama.parse({
        token: "token-mock-becca",
        id: "idError",
        content: "comentario teste um",
      });
      await commentaryBusiness.createCommentary(input)
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Requisição inválida");
        expect(error.statusCode).toBe(400);
      }
    }
  });
});
