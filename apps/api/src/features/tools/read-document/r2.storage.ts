import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class R2StorageService {
  private client: S3Client | null = null;

  constructor(private readonly configService: ConfigService) {}

  private getClient(): S3Client {
    if (this.client) return this.client;

    const accountId = this.configService.get<string>("r2AccountId");
    const accessKeyId = this.configService.get<string>("r2AccessKeyId");
    const secretAccessKey = this.configService.get<string>("r2SecretAccessKey");

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new ServiceUnavailableException(
        "Cloudflare R2 is not configured (R2_ACCOUNT_ID / keys)",
      );
    }

    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    return this.client;
  }

  private bucket(): string {
    const bucket = this.configService.get<string>("r2Bucket");
    if (!bucket) {
      throw new ServiceUnavailableException("R2_BUCKET is not configured");
    }
    return bucket;
  }

  async putObject(input: {
    key: string;
    body: Buffer;
    contentType: string;
  }): Promise<void> {
    await this.getClient().send(
      new PutObjectCommand({
        Bucket: this.bucket(),
        Key: input.key,
        Body: input.body,
        ContentType: input.contentType,
      }),
    );
  }

  async getObjectBuffer(key: string): Promise<Buffer> {
    const result = await this.getClient().send(
      new GetObjectCommand({
        Bucket: this.bucket(),
        Key: key,
      }),
    );
    const bytes = await result.Body?.transformToByteArray();
    if (!bytes) {
      throw new Error(`Empty R2 object: ${key}`);
    }
    return Buffer.from(bytes);
  }

  async deleteObject(key: string): Promise<void> {
    await this.getClient().send(
      new DeleteObjectCommand({
        Bucket: this.bucket(),
        Key: key,
      }),
    );
  }
}
