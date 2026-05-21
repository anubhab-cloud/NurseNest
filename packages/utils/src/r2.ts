import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

export interface R2Config {
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  endpoint: string;
  publicBaseUrl?: string;
}

export function createR2Client(config: R2Config): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

export async function createPresignedUploadUrl(
  client: S3Client,
  config: R2Config,
  contentType: string,
  folder = "uploads",
): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  const key = `${folder}/${randomUUID()}`;
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  const publicBase = config.publicBaseUrl ?? `${config.endpoint}/${config.bucket}`;
  const publicUrl = `${publicBase.replace(/\/$/, "")}/${key}`;
  return { uploadUrl, publicUrl, key };
}
