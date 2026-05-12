import type { Request, Response } from "express";
import { getCurrentUser } from "../../application/use-cases/getCurrentUser";

export class UserController {
  async me(request: Request, response: Response) {
    const auth = request.auth;
    if (!auth) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await getCurrentUser(auth.userId);
    response.status(200).json({ data: user });
  }
}
