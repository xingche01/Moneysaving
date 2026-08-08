import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { setSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
      return NextResponse.json({ error: "邮箱或密码不正确" }, { status: 401 });
    }
    await setSession(user.id);
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch {
    return NextResponse.json({ error: "请输入正确的邮箱和密码" }, { status: 400 });
  }
}
