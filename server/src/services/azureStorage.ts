import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, ContainerSASPermissions, SASProtocol } from "@azure/storage-blob";
import { env } from "../config/env.js";

function getBlobServiceClient() {
  if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
    return BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  }
  if (process.env.AZURE_STORAGE_ACCOUNT_NAME && process.env.AZURE_STORAGE_ACCOUNT_KEY) {
    const creds = new StorageSharedKeyCredential(
      process.env.AZURE_STORAGE_ACCOUNT_NAME,
      process.env.AZURE_STORAGE_ACCOUNT_KEY
    );
    const url = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`;
    return new BlobServiceClient(url, creds);
  }
  throw new Error("Azure Storage credentials are not set.");
}

export async function ensureContainer(containerName: string) {
  const client = getBlobServiceClient();
  const container = client.getContainerClient(containerName);
  await container.createIfNotExists({ access: "blob" }); // public read for GET (optional)
  return container;
}

export async function createUploadSAS(key: string, contentType = "image/jpeg") {
  const account = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
  const keyCred = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME!,
    process.env.AZURE_STORAGE_ACCOUNT_KEY!
  );

  const startsOn = new Date();
  const expiresOn = new Date(Date.now() + 60 * 1000); // 60s
  const sas = generateBlobSASQueryParameters(
    {
      protocol: SASProtocol.Https,
      containerName: process.env.AZURE_BLOB_CONTAINER!,
      blobName: key,
      permissions: ContainerSASPermissions.parse("w"), // write (PUT)
      startsOn,
      expiresOn,
      contentType
    },
    keyCred
  ).toString();

  const base = process.env.AZURE_BLOB_PUBLIC_BASE || `https://${account}.blob.core.windows.net`;
  const url = `${base}/${process.env.AZURE_BLOB_CONTAINER}/${encodeURIComponent(key)}?${sas}`;
  return { url, key };
}
