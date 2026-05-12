import type { Request, Response } from "express";
import { z } from "zod";
import { registerUser } from "../../application/use-cases/registerUser";
import { loginUser } from "../../application/use-cases/loginUser";
import { signToken } from "../../shared/auth/signToken";

const accountKindSchema = z.enum(["PERSONA", "EMPRESA"]);

const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(160),
    password: z.string().min(8).max(128),
    accountKind: accountKindSchema.default("PERSONA"),
    companyName: z.string().trim().max(160).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.accountKind === "EMPRESA") {
      const c = data.companyName?.trim();
      if (!c || c.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "companyName is required for EMPRESA (min 2 characters)",
          path: ["companyName"],
        });
      }
    }
  });

const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(1).max(128),
});

export class AuthController {
  async register(request: Request, response: Response) {
    const input = registerSchema.parse(request.body);
    const user = await registerUser({
      name: input.name,
      email: input.email,
      password: input.password,
      accountKind: input.accountKind,
      companyName: input.companyName ?? null,
    });
    const token = signToken(user.id, user.email, user.planType);
    response.status(201).json({
      data: {
        user,
        token,
      },
    });
  }

  async login(request: Request, response: Response) {
    const input = loginSchema.parse(request.body);
    const result = await loginUser(input);
    response.status(200).json({ data: result });
  }
}
