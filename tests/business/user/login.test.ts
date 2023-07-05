import { UserBusiness } from "../../../src/business/UserBusiness";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { LoginSchema } from "../../../src/dtos/user/login.dto";
import { ZodError } from "zod";
import { BadRequestError } from "../../../src/errors/BadRequestError";

describe("Testando Login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("Gera token do admin ao logar como admin", async () => {
    const input = LoginSchema.parse({
      email: "admin@email.com",
      password: "admin123"
    });

    const output = await userBusiness.login(input);

    expect(output).toEqual({token : "token-mock-admin"});
  });

  test("Gera token de becca ao logar como becca", async () => {
    const input = LoginSchema.parse({
      email: "becca@email.com",
      password: "becca123"
    });

    const output = await userBusiness.login(input);

    expect(output).toEqual({token : "token-mock-becca"});
  });

  test("Retorna erro caso o schema do login DTO email for inválido", async () => {
    expect.assertions(1)
    try {
        const input = LoginSchema.parse({
            email: "",
            password: "becca123"
        })
    } catch (error) {
        if(error instanceof ZodError) {
            expect(error.issues[0].message).toBe("Invalid email")
        }
    }
  })

  test("Retorna erro caso o schema do login DTO email não for string", async () => {
    expect.assertions(1)
    try {
        const input = LoginSchema.parse({
            email: 123,
            password: "becca123"
        })
    } catch (error) {
        if(error instanceof ZodError) {
            expect(error.issues[0].message).toBe("Expected string, received number")
        }
    }
  })

  test("Retorna erro caso o schema do login DTO password for inválido", async () => {
    expect.assertions(1)
    try {
        const input = LoginSchema.parse({
            email: "becca@email.com",
            password: ""
        })
    } catch (error) {
        if(error instanceof ZodError) {
            expect(error.issues[0].message).toBe("String must contain at least 4 character(s)")
        }
    }
  })

  test("Retorna erro caso o schema do login DTO password não for string", async () => {
    expect.assertions(1)
    try {
        const input = LoginSchema.parse({
            email: "becca@email.com",
            password: 123
        })
    } catch (error) {
        if(error instanceof ZodError) {
            expect(error.issues[0].message).toBe("Expected string, received number")
        }
    }
  })

  test("Retorna erro caso o E-mail não exista", async () => {
    expect.assertions(2)
    try {
        const input = LoginSchema.parse({
            email: "aaaaa@email.com",
            password: "admin123"
        })
        
        await userBusiness.login(input)
    } catch (error) {
        if(error instanceof BadRequestError){
            expect(error.statusCode).toBe(400)
            expect(error.message).toBe("E-mail e/ou Senha inválido(s).")
        }
    }
  })

  test("Retorna erro caso a senha não exista", async () => {
    expect.assertions(2)
    try {
        const input = LoginSchema.parse({
            email: "admin@email.com",
            password: "admin321"
        })
        
        await userBusiness.login(input)
    } catch (error) {
        if(error instanceof BadRequestError){
            expect(error.statusCode).toBe(400)
            expect(error.message).toBe("E-mail e/ou Senha inválido(s).")
        }
    }
  })
});
