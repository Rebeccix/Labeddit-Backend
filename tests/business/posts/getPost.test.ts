import { PostsBusiness } from "../../../src/business/PostsBusiness";
import { GetPostsSchema } from "../../../src/dtos/posts/getPosts.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostsDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { ZodError } from "zod";

describe("Testando getPost", () => {
  const postsBusiness = new PostsBusiness(
    new PostsDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Retorna Posts cadastrado", async () => {
    expect.assertions(1);
    const input = GetPostsSchema.parse({
      token: "token-mock-becca",
    });

    const output = await postsBusiness.getPosts(input);

    expect(output).toEqual([
        {
          id: 'p001',
          name: 'becca',
          content: 'Post test um',
          like: 2,
          dislike: 0,
          comments: 5
        },
        {
          id: 'p002',
          name: 'admin',
          content: 'Post test dois',
          like: -1,
          dislike: 5,
          comments: 2
        }
      ]);
  });

  test("Retonar erro caso token esteja inválido", async () => {
    expect.assertions(2);
    try {
      const input = GetPostsSchema.parse({
        token: "token-mock-error",
      });

      await postsBusiness.getPosts(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido");
        expect(error.statusCode).toBe(401);
      }
    }
  });

  test("Retonar erro caso token esteja vazio", async () => {
    expect.assertions(1);
    try {
      const input = GetPostsSchema.parse({
        token: "",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 1 character(s)"
        );
      }
    }
  });

  test("Retonar erro caso token seja number", async () => {
    expect.assertions(1);
    try {
      const input = GetPostsSchema.parse({
        token: 321421521521512,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "Expected string, received number"
        );
      }
    }
  });
});
