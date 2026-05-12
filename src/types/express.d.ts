import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    /** Rellenado por `requireAuth` tras validar el JWT */
    auth?: {
      userId: number;
      email: string;
      planType: string;
    };
  }
}

export {};
