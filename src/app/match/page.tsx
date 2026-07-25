"use client";

import Link from "next/link";

import { useGameStore } from "@/stores/game-store";


const commentary = [
  {
    minute: "12′",
    text: "대한민국이 중원에서 천천히 공격을 전개합니다.",
    important: false,
  },
  {
    minute: "18′",
    text: "황인범이 상대의 패스를 끊어냈습니다. 대한민국의 역습 기회입니다.",
    important: false,
  },
  {
    minute: "20′",
    text: "이강인이 오른쪽 측면에서 공을 잡고 손흥민의 침투를 확인합니다.",
    important: false,
  },
  {
    minute: "21′",
    text: "이강인의 날카로운 스루패스! 손흥민이 골키퍼와 맞섭니다.",
    important: true,
  },
];

export default function MatchPage() {
  const formation = useGameStore((state) => state.formation);
  const attackStyle = useGameStore((state) => state.attackStyle);
  const defenseStyle = useGameStore((state) => state.defenseStyle);
  const defensiveLine = useGameStore((state) => state.defensiveLine);

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="text-center">
          <p className="text-sm font-semibold text-red-400">
            GROUP STAGE · MATCHDAY 1
          </p>

          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-6">
            <div>
              <p className="text-4xl">🇰🇷</p>
              <p className="mt-2 text-xl font-semibold">대한민국</p>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)]">전반 21분</p>
              <p className="mt-2 text-5xl font-bold">0 : 0</p>
            </div>

            <div>
              <p className="text-4xl">🇲🇽</p>
              <p className="mt-2 text-xl font-semibold">멕시코</p>
            </div>
          </div>
        </header>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-400">LIVE</p>
                <h1 className="mt-1 text-2xl font-bold">AI 라디오 중계</h1>
              </div>

              <button
                type="button"
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm"
              >
                1× 속도
              </button>
            </div>

            <div className="mt-7 space-y-4">
              {commentary.map((event) => (
                <article
                  key={`${event.minute}-${event.text}`}
                  className={`rounded-xl border p-5 ${
                    event.important
                      ? "border-red-500/60 bg-red-500/10"
                      : "border-[var(--border)] bg-[var(--background)]"
                  }`}
                >
                  <p className="text-sm font-semibold text-red-400">
                    {event.minute}
                  </p>

                  <p className="mt-2 leading-7">{event.text}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h2 className="font-semibold">경기 기록</h2>

              <div className="mt-5 space-y-4 text-sm">
                <MatchStat label="점유율" home="46%" away="54%" />
                <MatchStat label="슈팅" home="2" away="3" />
                <MatchStat label="유효 슈팅" home="1" away="1" />
                <MatchStat label="패스 성공률" home="83%" away="86%" />
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-sm text-[var(--muted)]">현재 전술</p>
              
              <p className="mt-2 font-semibold">
                {attackStyle} · {defenseStyle}
              </p>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-[var(--muted)]">포메이션</span>
                  <span>{formation}</span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-[var(--muted)]">수비 라인</span>
                  <span>{defensiveLine}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-lg border border-[var(--border)] px-4 py-3 text-sm hover:bg-[var(--surface-light)]"
              >
                감독 지시
              </button>
            </section>

            <Link
              href="/result"
              className="block rounded-xl bg-[var(--primary)] px-5 py-4 text-center font-semibold text-white hover:bg-[var(--primary-hover)]"
            >
              임시로 경기 종료
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}

type MatchStatProps = {
  label: string;
  home: string;
  away: string;
};

function MatchStat({ label, home, away }: MatchStatProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <span className="font-semibold">{home}</span>
      <span className="text-[var(--muted)]">{label}</span>
      <span className="text-right font-semibold">{away}</span>
    </div>
  );
}