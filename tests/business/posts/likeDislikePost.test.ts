import { PostsBusiness } from "../../../src/business/PostsBusiness";
import { likeDislikePostSchema } from "../../../src/dtos/posts/likeDislike.dto";
import { BadRequestError } from "../../../src/errors/BadRequestError";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostsDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { ZodError } from "zod"

describe("Testando likeDislikePost", () => {
  const postsBusiness = new PostsBusiness(
    new PostsDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Retorna undefined caso o likeDislike tenha funcionado", async () => {
    expect.assertions(1);
    const input = likeDislikePostSchema.parse({
      token: "token-mock-becca",
      idPostToLikeDislike: "p001",
      like: true,
    });

    const output = await postsBusiness.likeDislikePost(input);

    expect(output).toBe(undefined);
  });

  test("Retorna undefined caso o like senha false e a tabela likeDislike não exista", async () => {
    expect.assertions(1);
    const input = likeDislikePostSchema.parse({
      token: "token-mock-becca",
      idPostToLikeDislike: "p001",
      like: false,
    });

    const output = await postsBusiness.likeDislikePost(input);

    expect(output).toBe(undefined);
  });

  test("Retorna undefined caso o like sejá true e post já foi liked", async () => {
    expect.assertions(1);
    const input = likeDislikePostSchema.parse({
      token: "token-mock-becca",
      idPostToLikeDislike: "p002",
      like: true,
    });

    const output = await postsBusiness.likeDislikePost(input);

    expect(output).toBe(undefined);
  });

  test("Retorna undefined caso o like sejá false e post foi liked", async () => {
    expect.assertions(1);
    const input = likeDislikePostSchema.parse({
      token: "token-mock-becca",
      idPostToLikeDislike: "p002",
      like: false,
    });

    const output = await postsBusiness.likeDislikePost(input);

    expect(output).toBe(undefined);
  });

  test("Retorna undefined caso o like sejá true e post ainda não foi liked", async () => {
    expect.assertions(1);
    const input = likeDislikePostSchema.parse({
      token: "token-mock-admin",
      idPostToLikeDislike: "p001",
      like: true,
    });

    const output = await postsBusiness.likeDislikePost(input);

    expect(output).toBe(undefined);
  });

  test("Retorna undefined caso o like sejá false e post ainda não foi liked", async () => {
    expect.assertions(1);
    const input = likeDislikePostSchema.parse({
      token: "token-mock-admin",
      idPostToLikeDislike: "p001",
      like: false,
    });

    const output = await postsBusiness.likeDislikePost(input);

    expect(output).toBe(undefined);
  });

  test("Retornar undefined caso o token seja inválido", async () => {
    expect.assertions(2);
    try {
      const input = likeDislikePostSchema.parse({
        token: "token-mock-error",
        idPostToLikeDislike: "p001",
        like: true,
      });

      await postsBusiness.likeDislikePost(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido");
        expect(error.statusCode).toBe(401);
      }
    }
  });

  test("Retornar undefined caso o post não exista", async () => {
    expect.assertions(2);
    try {
      const input = likeDislikePostSchema.parse({
        token: "token-mock-becca",
        idPostToLikeDislike: "idError",
        like: true,
      });

      await postsBusiness.likeDislikePost(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Post não existe");
        expect(error.statusCode).toBe(400);
      }
    }
  });

  test("Retornar erro caso token esteja inválido", async () => {
    expect.assertions(1);
    try {
      const input = likeDislikePostSchema.parse({
        token: "",
        idPostToLikeDislike: "idError",
        like: true,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("String must contain at least 1 character(s)")
      }
    }
  });

  test("Retornar erro caso idPostToLikeDislike esteja inválido", async () => {
    expect.assertions(1);
    try {
      const input = likeDislikePostSchema.parse({
        token: "token-mock-becca",
        idPostToLikeDislike: "",
        like: true,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("'id' deve possuir no mínimo 1 caracteres")
      }
    }
  });

  test("Retornar erro caso like não seja true nem false", async () => {
    expect.assertions(1);
    try {
      const input = likeDislikePostSchema.parse({
        token: "token-mock-becca",
        idPostToLikeDislike: "p001",
        like: "",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("Expected boolean, received string")
      }
    }
  });
});
