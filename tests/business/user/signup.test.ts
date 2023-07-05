import { UserBusiness } from "../../../src/business/UserBusiness";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { SignupSchema } from "../../../src/dtos/user/signup.dto";
import { ZodError } from "zod";
import { BadRequestError } from "../../../src/errors/BadRequestError";

describe("Testando Signup", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("deve gerar token ao cadatrar um novo User", async () => {
    expect.assertions(1);
    const input = SignupSchema.parse({
      name: "fulano",
      email: "fulano@email.com",
      password: "fulano123",
    });

    const output = await userBusiness.signup(input);

    expect(output).toEqual({
      token: "token-mock",
    });
  });

  test("deve retornar um erro caso o email já esteja cadastrado", async () => {
    expect.assertions(2);
    try {
      const input = SignupSchema.parse({
        name: "fulano",
        email: "becca@email.com",
        password: "fulano123",
      });

      await userBusiness.signup(input);

    } catch (error) {
        if(error instanceof BadRequestError) {
            expect(error.statusCode).toBe(400)
            expect(error.message).toBe("Email já existe")
       }
    }
  });

  test("deve retornar um erro caso o schema do signup DTO name for inválido", async () => {
    expect.assertions(1);
    try {
      const input = SignupSchema.parse({
        name: "",
        email: "fulano@email.com",
        password: "fulano123",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 3 character(s)"
        );
      }
    }
  });

  test("deve retornar um erro caso o schema do signup DTO email for inválido", async () => {
    expect.assertions(1);

    try {
      const input = SignupSchema.parse({
        name: "fulano",
        email: "fulanoeemail.com",
        password: "fulano123",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("Invalid email");
      }
    }
  });

  test("deve retornar um erro caso o schema do signup DTO password for inválido", async () => {
    expect.assertions(1);

    try {
      const input = SignupSchema.parse({
        name: "fulano",
        email: "fulanoe@email.com",
        password: "",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 4 character(s)"
        );
      }
    }
  });
});
