import { AuthForm } from "@/components/auth-form";

export default function Home() {
  return (
    <main className="landing-shell">
      <section className="hero">
        <a className="brand" href="/">ledgerly<span>·</span></a>
        <div className="hero-copy">
          <p className="eyebrow">个人财务，清晰可见</p>
          <h1>每一笔，都是<br /><em>更从容的生活。</em></h1>
          <p className="lead">一个为日常设计的轻量账本。记录收入与支出，看见你的消费习惯，慢慢建立安心感。</p>
        </div>
        <div className="feature-list" aria-label="产品特点">
          <span>◌ 收支一目了然</span><span>◌ 自动计算余额</span><span>◌ 账户数据专属加密</span>
        </div>
      </section>
      <AuthForm />
    </main>
  );
}
