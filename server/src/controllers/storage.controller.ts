import type { Request, Response } from "express";
import crypto from "crypto";
import { createUploadSAS, ensureContainer } from "../services/azureStorage.js";
import { env } from "../config/env.js";

export const storageController = {
  async presign(req: Request, res: Response) {
    // Ensure container exists
    await ensureContainer(process.env.AZURE_BLOB_CONTAINER!);

    const ext = (req.query.ext as string) || "jpg";
    const contentType = (req.query.contentType as string) || "image/jpeg";
    const userId = req.user?.id || "anon";
    const key = `users/${userId}/disease/${crypto.randomUUID()}.${ext}`;

    const { url } = await createUploadSAS(key, contentType);
    return res.json({ url, key, contentType });
  }
};
