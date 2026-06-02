import type { Request, Response } from "express";
import {
  DeleteUserFile,
  ListUserFiles,
  UploadUserFile,
} from "../../application/use-cases/userFiles";
import { userFileRepository } from "../../infrastructure/repositories/prismaUserFileRepository";
import { parseUuidParam } from "../../shared/http/parseIdParam";

const uploadUserFile = new UploadUserFile(userFileRepository);
const listUserFiles = new ListUserFiles(userFileRepository);
const deleteUserFile = new DeleteUserFile(userFileRepository);

function serializeFile(file: {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
}) {
  return {
    id: file.id,
    name: file.originalName,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
    createdAt: file.createdAt,
  };
}

export class FileController {
  async upload(request: Request, response: Response) {
    const auth = request.auth;
    if (!auth) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    const file = request.file;
    if (!file) {
      response.status(400).json({ message: "No se recibió ningún archivo (campo: file)" });
      return;
    }

    const record = await uploadUserFile.execute({
      userId: auth.userId,
      userPlan: auth.planType,
      originalName: file.originalname,
      mimeType: file.mimetype,
      buffer: file.buffer,
    });

    response.status(201).json({ data: serializeFile(record) });
  }

  async index(request: Request, response: Response) {
    const auth = request.auth;
    if (!auth) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    const files = await listUserFiles.execute(auth.userId);
    response.status(200).json({ data: files.map(serializeFile) });
  }

  async destroy(request: Request, response: Response) {
    const auth = request.auth;
    if (!auth) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    const id = parseUuidParam(request);
    await deleteUserFile.execute(auth.userId, id);
    response.status(204).send();
  }
}
