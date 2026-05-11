import type { NextFunction, Request, Response } from "express";

type AsyncController = (request: Request, response: Response, next: NextFunction) => Promise<void>;

export function asyncHandler(controller: AsyncController) {
  return (request: Request, response: Response, next: NextFunction) => {
    controller(request, response, next).catch(next);
  };
}
