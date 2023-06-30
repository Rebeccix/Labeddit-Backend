import { UserBusiness } from "../../../src/business/UserBusiness";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { LoginSchema } from "../../../src/dtos/user/login.dto";

describe("Testando Login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("deve gerar token ao logar", async () => {
    const input = LoginSchema.parse({
      email: "becca@gmail.com",
      password: "becca123"
    });

    const output = await userBusiness.login(input);

    expect(output).toEqual({token : "token-mock-admin"});
  });
});
