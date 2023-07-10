import { PostsBusiness } from "../../../src/business/PostsBusiness";
import { PostsDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { deletePostSchema } from "../../../src/dtos/posts/deletePost.dto";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbidenError";
import { ZodError } from "zod";

describe("Testando delete do post", () => {
  const postsBusiness = new PostsBusiness(
    new PostsDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Retorna nada ao deletar um post", async () => {
    const input = deletePostSchema.parse({
      token: "token-mock-becca",
      id: "p001",
    });

    const output = await postsBusiness.deletePost(input);

    expect(output).toBe(undefined);
  });

  test("Retorna erro caso token esteja inválido", async () => {
    expect.assertions(1);
    try {
      const input = deletePostSchema.parse({
        token: "token-mock-error",
        id: "p001",
      });

      await postsBusiness.deletePost(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido");
      }
    }
  });

  test("Retorna erro caso id não exista", async () => {
    expect.assertions(1);
    try {
      const input = deletePostSchema.parse({
        token: "token-mock-becca",
        id: "Error",
      });

      await postsBusiness.deletePost(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("Recurso não encontrado");
      }
    }
  });

  test("Retorna erro caso token não seja um admin e nem o criador do post", async () => {
    expect.assertions(1);
    try {
      const input = deletePostSchema.parse({
        token: "token-mock-becca",
        id: "p002",
      });

      await postsBusiness.deletePost(input);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        expect(error.message).toBe(
          "Token válido, mas sem permissões suficientes"
        );
      }
    }
  });

  test("Retorna erro caso token esteja vazio", async () => {
    expect.assertions(1);
    try {
      const input = deletePostSchema.parse({
        token: "",
        id: "p001",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 1 character(s)"
        );
      }
    }
  });

  test("Retornar erro caso id esteja vazio", async () => {
    expect.assertions(1);
    try {
      const input = deletePostSchema.parse({
        token: "token-mock-becca",
        id: "",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "'id' deve possuir no mínimo 1 caractere"
        );
      }
    }
  });
});
