import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const dbUrl =
    process.env.DATABASE_URL || "mysql://root:root@localhost:3306/senapan_angin";

  try {
    // Parse MySQL connection URI
    const parsed = new URL(dbUrl.replace(/^mysql:\/\//, "http://"));
    const isCloud =
      parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1";

    const config: Record<string, unknown> = {
      host: parsed.hostname,
      port: Number(parsed.port) || 3306,
      user: decodeURIComponent(parsed.username || "root"),
      password: decodeURIComponent(parsed.password || ""),
      database: parsed.pathname.replace(/^\//, "") || "test",
      connectionLimit: 10,
      connectTimeout: 10000,
    };

    if (isCloud) {
      config.ssl = { rejectUnauthorized: false };
      config.allowPublicKeyRetrieval = true;
    }

    const adapter = new PrismaMariaDb(config as any);
    return new PrismaClient({ adapter });
  } catch (error) {
    console.error("Falling back to raw connection string adapter:", error);
    const adapter = new PrismaMariaDb(dbUrl);
    return new PrismaClient({ adapter });
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
