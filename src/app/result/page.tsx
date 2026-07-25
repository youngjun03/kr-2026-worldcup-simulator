import Link from "next/link";

const reportItems = [
  {
    title: "잘 작동한 전술",
    description:
      "멕시코의 전방 압박 뒤에 발생한 공간을 빠른 전진 패스로 공략했습니다.",
  },
  {
    title: "개선할 부분",
    description:
      "오른쪽 측면 수비 지원이 늦어 상대에게 여러 차례 크로스 기회를 허용했습니다.",
  },
  {
    title: "다음 경기 제안",
    description:
      "중앙 미드필더의 수비 가담을 높이고 후반에는 수비 라인을 한 단계 낮추는 것이 좋습니다.",
  },
];

export default function ResultPage() {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          <p className="text-sm font-semibold text-red-400">FULL TIME</p>

          <h1 className="mt-4 text-4xl font-bold">경기 종료</h1>

          <div className="mt-8 flex items-center justify-center gap-8">
            <div>
              <p className="text-4xl">🇰🇷</p>
              <p className="mt-2 font-semibold">대한민국</p>
            </div>

            <p className="text-6xl font-bold">2 : 1</p>

            <div>
              <p className="text-4xl">🇲🇽</p>
              <p className="mt-2 font-semibold">멕시코</p>
            </div>
          </div>

          <p className="mt-6 text-xl font-semibold text-red-400">
            조별리그 첫 승리
          </p>
        </header>

        <section className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7">
          <p className="text-sm font-semibold text-red-400">
            AI TACTICAL REPORT
          </p>

          <h2 className="mt-2 text-2xl font-bold">감독 전술 분석</h2>

          <p className="mt-5 leading-8 text-[var(--muted)]">
            대한민국은 수비 진영에서 무리하게 점유율을 높이기보다 빠른
            전환을 선택했습니다. 이 전략은 멕시코의 높은 압박 뒤에
            발생한 공간을 공략하는 데 효과적이었습니다.
          </p>

          <div className="mt-8 grid gap-4">
            {reportItems.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5"
              >
                <h3 className="font-semibold">{item.title}</h3>

                <p className="mt-2 leading-7 text-[var(--muted)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/tactics"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-4 text-center font-semibold hover:bg-[var(--surface-light)]"
          >
            전술 다시 설정
          </Link>

          <Link
            href="/"
            className="rounded-xl bg-[var(--primary)] px-6 py-4 text-center font-semibold text-white hover:bg-[var(--primary-hover)]"
          >
            처음으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}