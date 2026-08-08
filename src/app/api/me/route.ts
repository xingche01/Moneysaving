import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });
  return NextResponse.json({ user });
}
