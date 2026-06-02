export type UserFileRecord = {
  id: string;
  userId: number;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  createdAt: Date;
};

export type CreateUserFileInput = {
  userId: number;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
};

export interface UserFileRepository {
  create(input: CreateUserFileInput): Promise<UserFileRecord>;
  listByUser(userId: number): Promise<UserFileRecord[]>;
  countByUser(userId: number): Promise<number>;
  findByIdForUser(id: string, userId: number): Promise<UserFileRecord | null>;
  deleteById(id: string): Promise<void>;
}
