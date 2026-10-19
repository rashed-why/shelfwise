import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { Client } from "pg";

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "12345678";
const ADMIN_NAME = "Admin";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const existing = await client.query(
      'SELECT id FROM "User" WHERE email = $1',
      [ADMIN_EMAIL],
    );

    if (existing.rowCount) {
      await client.query(
        'UPDATE "User" SET name = $1, password = $2, role = $3, "updatedAt" = NOW() WHERE email = $4',
        [ADMIN_NAME, passwordHash, "ADMIN", ADMIN_EMAIL],
      );
      console.log(`Updated admin user: ${ADMIN_EMAIL}`);
    } else {
      await client.query(
        'INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
        [randomUUID(), ADMIN_NAME, ADMIN_EMAIL, passwordHash, "ADMIN"],
      );
      console.log(`Created admin user: ${ADMIN_EMAIL}`);
    }
  } finally {
    await client.end();
  }
}

void main();
