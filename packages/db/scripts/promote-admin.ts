import { PrismaClient } from "@prisma/client";
const email = process.argv.find(arg => arg.includes("@"))?.trim().toLowerCase();
if (!email) throw new Error("Provide the email of an existing registered user. This command must be run by the deployment operator.");
const prisma = new PrismaClient();
try {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found. Register first; this command does not create accounts.");
  await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN", isActive: true } });
  process.stdout.write("Administrator role granted to the selected registered account. Sign out and back in.\n");
} finally { await prisma.$disconnect(); }
