import z from "zod";

export interface LoginInputDTO {
  email: string;
  password: string;
}

export interface LoginOutputDTO {
  token: string;
}

export const LoginSchema = z
  .object({
    email: z
      .string({
        required_error: "'email' é obrigatória",
        invalid_type_error: "'email' deve ser do tipo string",
      })
      .email("'email' inválido"),
    password: z
      .string({
        required_error: "'password' é obrigatório",
        invalid_type_error: "'password' deve ser do tipo string",
      })
      .min(4, "'password' deve possuir no mínimo 4 caracteres"),
  })
  .transform((data) => data as LoginInputDTO);
