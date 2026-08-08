import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.coerce.number().positive("金额必须大于 0").max(99999999),
  category: z.string().trim().min(1, "请选择分类").max(30),
  note: z.string().trim().max(280).optional(),
  date: z.string().datetime().transform((value) => new Date(value)),
});

async function userOrUnauthorized() {
  const userId = await currentUserId();
  return userId;
}

export async function GET() {
  const userId = await userOrUnauthorized();
  if (!userId) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take: 100,
  });
  return NextResponse.json({ transactions });
}

export async function POST(request: Request) {
  const userId = await userOrUnauthorized();
  if (!userId) return NextResponse.json({ error: "未登录" }, { status: 401 });
  try {
    const body = schema.parse(await request.json());
    const transaction = await prisma.transaction.create({ data: { ...body, userId, note: body.note || null } });
    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    const message = error instanceof z.ZodError ? error.issues[0]?.message : "保存失败，请稍后重试";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
