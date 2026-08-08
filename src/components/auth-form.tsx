"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    };
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "操作失败，请重试");
      router.push("/dashboard");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "操作失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card" aria-labelledby="auth-title">
      <div className="tabs" role="tablist" aria-label="账户操作">
        <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} role="tab" aria-selected={mode === "login"}>登录</button>
        <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")} role="tab" aria-selected={mode === "register"}>注册</button>
      </div>
      <h2 id="auth-title">{mode === "login" ? "欢迎回来" : "建立你的账本"}</h2>
      <p className="muted">{mode === "login" ? "登录后继续管理每一笔收支。" : "开始记录，让钱花得明明白白。"}</p>
      <form onSubmit={submit} className="form-stack">
        {mode === "register" && <label>昵称<input name="name" placeholder="怎么称呼你" maxLength={40} /></label>}
        <label>邮箱<input name="email" type="email" placeholder="you@example.com" required autoComplete="email" /></label>
        <label>密码<input name="password" type="password" placeholder={mode === "register" ? "至少 8 位" : "输入你的密码"} required minLength={mode === "register" ? 8 : 1} autoComplete={mode === "register" ? "new-password" : "current-password"} /></label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="button primary" disabled={loading}>{loading ? "处理中…" : mode === "login" ? "登录账本" : "创建账户"}</button>
      </form>
      <p className="security-note">密码会经过不可逆加密后再保存。</p>
    </section>
  );
}
