# Ledgerly 记账工具

一个可部署到 Vercel 的个人记账网页，支持注册登录、收入/支出记录、分类统计和历史流水。

## 部署到 Vercel

1. 在 Neon、Supabase 或任意 PostgreSQL 服务创建数据库。
2. 在 Vercel 项目的 Environment Variables 中添加 `DATABASE_URL` 与 `JWT_SECRET`。
3. 导入 GitHub 仓库，Vercel 会自动执行构建与 Prisma 数据库迁移。
4. 部署完成后，打开网址注册第一个账户即可开始记账。

