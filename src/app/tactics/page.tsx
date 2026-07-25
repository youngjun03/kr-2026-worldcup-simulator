"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ATTACK_STYLES,
  DEFENSE_STYLES,
  DEFENSIVE_LINES,
  FORMATIONS,
} from "@/data/tactics";
import { useGameStore } from "@/stores/game-store";

import type {
  AttackStyle,
  DefenseStyle,
  DefensiveLine,
  Formation,
} from "@/types/game";

export default function TacticsPage() {
  const router = useRouter();

  const formation = useGameStore((state) => state.formation);
  const attackStyle = useGameStore((state) => state.attackStyle);
  const defenseStyle = useGameStore((state) => state.defenseStyle);
  const defensiveLine = useGameStore((state) => state.defensiveLine);

  const setFormation = useGameStore((state) => state.setFormation);
  const setAttackStyle = useGameStore((state) => state.setAttackStyle);
  const setDefenseStyle = useGameStore((state) => state.setDefenseStyle);
  const setDefensiveLine = useGameStore(
    (state) => state.setDefensiveLine,
  );
  const resetTactics = useGameStore((state) => state.resetTactics);

  const startMatch = () => {
    router.push("/match");
  };

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
          <div>
            <p className="text-sm font-semibold text-red-400">
              MATCH PREPARATION
            </p>

            <h1 className="mt-2 text-3xl font-bold">전술 설정</h1>

            <p className="mt-2 text-[var(--muted)]">
              조별리그 1차전 · 대한민국 vs 멕시코
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetTactics}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--surface)]"
            >
              초기화
            </button>

            <Link
              href="/"
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--surface)]"
            >
              홈으로
            </Link>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">선발 명단</h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  선수 데이터와 배치 기능은 다음 단계에서 추가합니다.
                </p>
              </div>

              <span className="rounded-full bg-[var(--surface-light)] px-4 py-2 text-sm font-semibold">
                {formation}
              </span>
            </div>

            <div className="mt-6 flex min-h-[520px] items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[#0b3a22]">
              <div className="text-center">
                <p className="text-5xl">⚽</p>

                <p className="mt-4 text-lg font-semibold">
                  {formation} 전술 보드
                </p>

                <p className="mt-2 text-sm text-white/60">
                  선택한 포메이션에 따라 선수 위치가 변경될 예정입니다.
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="text-xl font-semibold">팀 전술</h2>

              <p className="mt-2 text-sm text-[var(--muted)]">
                각 항목을 선택해 경기 운영 방식을 설정하세요.
              </p>

              <div className="mt-5 space-y-4">
                <TacticSelect
                  label="포메이션"
                  value={formation}
                  options={FORMATIONS}
                  onChange={(value) => {
                    setFormation(value as Formation);
                  }}
                />

                <TacticSelect
                  label="공격 방식"
                  value={attackStyle}
                  options={ATTACK_STYLES}
                  onChange={(value) => {
                    setAttackStyle(value as AttackStyle);
                  }}
                />

                <TacticSelect
                  label="수비 방식"
                  value={defenseStyle}
                  options={DEFENSE_STYLES}
                  onChange={(value) => {
                    setDefenseStyle(value as DefenseStyle);
                  }}
                />

                <TacticSelect
                  label="수비 라인"
                  value={defensiveLine}
                  options={DEFENSIVE_LINES}
                  onChange={(value) => {
                    setDefensiveLine(value as DefensiveLine);
                  }}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <p className="text-sm text-[var(--muted)]">현재 전술 요약</p>

              <div className="mt-4 space-y-2 text-sm">
                <SummaryRow label="포메이션" value={formation} />
                <SummaryRow label="공격" value={attackStyle} />
                <SummaryRow label="수비" value={defenseStyle} />
                <SummaryRow label="수비 라인" value={defensiveLine} />
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <p className="text-sm text-[var(--muted)]">상대 분석</p>

              <h2 className="mt-2 text-xl font-semibold">멕시코</h2>

              <p className="mt-4 leading-7 text-[var(--muted)]">
                빠른 측면 공격과 적극적인 전방 압박이 강점입니다.
                압박 이후 발생하는 뒷공간을 공략할 필요가 있습니다.
              </p>
            </section>

            <button
              type="button"
              onClick={startMatch}
              className="w-full rounded-xl bg-[var(--primary)] px-6 py-4 font-semibold text-white hover:bg-[var(--primary-hover)]"
            >
              이 전술로 경기 시작
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

type TacticSelectProps = {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
};

function TacticSelect({
  label,
  value,
  options,
  onChange,
}: TacticSelectProps) {
  return (
    <label className="block rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
      <span className="text-sm text-[var(--muted)]">{label}</span>

      <select
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className="mt-2 w-full cursor-pointer bg-transparent font-semibold outline-none"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[var(--background)]"
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}