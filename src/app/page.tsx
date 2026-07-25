import Link from "next/link";

const serviceSteps = [
  {
    number: "01",
    title: "전술 설계",
    description: "포메이션과 선발 명단, 공격·수비 전술을 설정합니다.",
  },
  {
    number: "02",
    title: "경기 지휘",
    description: "AI 라디오 중계를 확인하며 교체와 전술 변경을 지시합니다.",
  },
  {
    number: "03",
    title: "전술 분석",
    description: "경기 종료 후 AI가 승패 원인과 개선점을 분석합니다.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-[var(--border)] pb-5">
          <div>
            <p className="text-sm font-medium text-red-400">
              2026 WORLD CUP
            </p>

            <p className="mt-1 text-lg font-semibold">
              대한민국 감독 시뮬레이터
            </p>
          </div>

          <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]">
            AI Tactical Simulation
          </span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-20">
          <p className="mb-5 text-sm font-semibold tracking-[0.3em] text-red-400">
            ROAD TO GLORY
          </p>

          <h1 className="max-w-4xl text-5xl leading-tight font-bold tracking-tight sm:text-7xl">
            대한민국을
            <br />
            월드컵 우승으로.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            대한민국 국가대표팀 감독이 되어 선수를 배치하고 전술을
            설계하세요. AI 라디오 중계를 통해 경기 흐름을 확인하고,
            결정적인 순간에 직접 감독 지시를 내릴 수 있습니다.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/tactics"
              className="rounded-xl bg-[var(--primary)] px-7 py-4 font-semibold text-white hover:bg-[var(--primary-hover)]"
            >
              감독직 시작하기
            </Link>

            <a
              href="#service-flow"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-7 py-4 font-semibold hover:bg-[var(--surface-light)]"
            >
              서비스 알아보기
            </a>
          </div>
        </section>

        <section
          id="service-flow"
          className="grid gap-4 border-t border-[var(--border)] py-10 md:grid-cols-3"
        >
          {serviceSteps.map((step) => (
            <article
              key={step.number}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <p className="text-sm font-semibold text-red-400">
                {step.number}
              </p>

              <h2 className="mt-5 text-xl font-semibold">{step.title}</h2>

              <p className="mt-3 leading-7 text-[var(--muted)]">
                {step.description}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}