# Ledgerly 记账工具

一个可部署到 Vercel 的个人记账网页，支持注册登录、收入/支出记录、分类统计和历史流水。账户密码会通过 bcrypt 生成不可逆哈希后保存，绝不会以明文写入数据库。

## 本地启动

1. 复制 `.env.example` 为 `.env`，填入 PostgreSQL 的 `DATABASE_URL` 和随机 `JWT_SECRET`。
2. 运行 `npm install`。
3. 运行 `npm run db:migrate -- --name init` 创建数据表。
4. 运行 `npm run dev`，访问 `http://localhost:3000`。

## 部署到 Vercel

1. 在 Neon、Supabase 或任意 PostgreSQL 服务创建数据库。
2. 在 Vercel 项目的 Environment Variables 中添加 `DATABASE_URL` 与 `JWT_SECRET`。
3. 导入 GitHub 仓库，Vercel 会自动执行构建与 Prisma 数据库迁移。
4. 部署完成后，打开网址注册第一个账户即可开始记账。

> 建议使用 `openssl rand -base64 32` 生成 `JWT_SECRET`。不要将 `.env` 提交到 Git。
