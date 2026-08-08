import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const { id } = await params;
  const deleted = await prisma.transaction.deleteMany({ where: { id, userId } });
  if (!deleted.count) return NextResponse.json({ error: "未找到记录" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
