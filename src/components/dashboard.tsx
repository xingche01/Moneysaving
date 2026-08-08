"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Transaction = { id: string; type: "INCOME" | "EXPENSE"; amount: string | number; category: string; note: string | null; date: string };
type User = { name: string | null; email: string };

const incomeCategories = ["工资", "奖金", "副业", "投资", "退款", "其他"];
const expenseCategories = ["餐饮", "交通", "购物", "住房", "娱乐", "医疗", "学习", "人情", "其他"];
const money = new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" });

export function Dashboard() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);

  async function load() {
    const [me, records] = await Promise.all([fetch("/api/me"), fetch("/api/transactions")]);
    if (me.status === 401 || records.status === 401) { router.replace("/"); return; }
    const meData = await me.json();
    const recordData = await records.json();
    setUser(meData.user);
    setTransactions(recordData.transactions || []);
    setReady(true);
  }

  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const summary = useMemo(() => transactions.reduce((totals, item) => {
    const value = Number(item.amount);
    if (item.type === "INCOME") totals.income += value; else totals.expense += value;
    return totals;
  }, { income: 0, expense: 0 }), [transactions]);

  async function addTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setSaving(true);
    const form = new FormData(event.currentTarget);
    const result = await fetch("/api/transactions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, amount: form.get("amount"), category: form.get("category"), note: form.get("note"), date: new Date(`${form.get("date")}T12:00:00`).toISOString() }),
    });
    const data = await result.json();
    if (!result.ok) setError(data.error || "保存失败");
    else { setTransactions((items) => [data.transaction, ...items]); event.currentTarget.reset(); }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!window.confirm("确定删除这条记录吗？")) return;
    const response = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (response.ok) setTransactions((items) => items.filter((item) => item.id !== id));
  }

  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.replace("/"); }

  if (!ready) return <main className="loading">正在打开你的账本…</main>;
  const today = new Date().toLocaleDateString("en-CA");
  const categories = type === "INCOME" ? incomeCategories : expenseCategories;

  return <main className="dashboard-shell">
    <header className="dashboard-header"><a className="brand" href="/dashboard">ledgerly<span>·</span></a><div className="profile"><span>{user?.name || user?.email}</span><button onClick={logout} className="text-button">退出</button></div></header>
    <section className="dashboard-title"><div><p className="eyebrow">你的财务概览</p><h1>今天，也好好生活。</h1></div><p className="date-label">{new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}</p></section>
    <section className="summary-grid" aria-label="财务汇总">
      <article className="summary-card balance"><p>当前结余</p><strong>{money.format(summary.income - summary.expense)}</strong><small>收入减去支出</small></article>
      <article className="summary-card"><p>累计收入</p><strong className="income">+ {money.format(summary.income)}</strong><small>{transactions.filter((item) => item.type === "INCOME").length} 笔记录</small></article>
      <article className="summary-card"><p>累计支出</p><strong className="expense">− {money.format(summary.expense)}</strong><small>{transactions.filter((item) => item.type === "EXPENSE").length} 笔记录</small></article>
    </section>
    <section className="content-grid">
      <aside className="entry-card"><p className="eyebrow">新增一笔</p><h2>记录现在</h2><div className="type-toggle"><button className={type === "EXPENSE" ? "selected expense-bg" : ""} onClick={() => setType("EXPENSE")}>支出</button><button className={type === "INCOME" ? "selected income-bg" : ""} onClick={() => setType("INCOME")}>收入</button></div>
        <form onSubmit={addTransaction} className="form-stack entry-form"><label>金额<input name="amount" type="number" inputMode="decimal" min="0.01" step="0.01" placeholder="0.00" required /></label><label>分类<select name="category" key={type} defaultValue=""> <option value="" disabled>选择一个分类</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label><label>日期<input name="date" type="date" defaultValue={today} required /></label><label>备注 <span className="optional">可选</span><input name="note" maxLength={280} placeholder="这笔钱花在了哪里？" /></label>{error && <p className="error" role="alert">{error}</p>}<button className="button primary" disabled={saving}>{saving ? "保存中…" : "保存记录"}</button></form>
      </aside>
      <section className="history-card"><div className="section-heading"><div><p className="eyebrow">最近流水</p><h2>账目历史</h2></div><span>{transactions.length} 笔</span></div>{transactions.length === 0 ? <div className="empty-state"><b>从第一笔开始</b><p>在左侧记录收入或支出，它会出现在这里。</p></div> : <ul className="transaction-list">{transactions.map((item) => <li key={item.id}><div className={`category-dot ${item.type === "INCOME" ? "dot-income" : "dot-expense"}`}>{item.category.slice(0, 1)}</div><div className="transaction-info"><b>{item.category}</b><span>{new Date(item.date).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}{item.note ? ` · ${item.note}` : ""}</span></div><strong className={item.type === "INCOME" ? "income" : "expense"}>{item.type === "INCOME" ? "+" : "−"}{money.format(Number(item.amount))}</strong><button aria-label={`删除 ${item.category} 记录`} title="删除记录" className="delete-button" onClick={() => void remove(item.id)}>×</button></li>)}</ul>}</section>
    </section>
  </main>;
}
