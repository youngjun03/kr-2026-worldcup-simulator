"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { LineupBuilder } from "@/components/tactics/lineup-builder";
import { LineupEvaluationCard } from "@/components/tactics/lineup-evaluation-card";
import { TeamRatingCard } from "@/components/tactics/team-rating-card";
import { MatchPreviewCard } from "@/components/tactics/match-preview-card";
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

  // 현재 전술 상태
  const formation = useGameStore((state) => state.formation);
  const attackStyle = useGameStore((state) => state.attackStyle);
  const defenseStyle = useGameStore((state) => state.defenseStyle);
  const defensiveLine = useGameStore(
    (state) => state.defensiveLine,
  );

  // 현재 선발 배치 상태
  const lineup = useGameStore((state) => state.lineup);

  // 전술 변경 함수
  const setFormation = useGameStore(
    (state) => state.setFormation,
  );
  const setAttackStyle = useGameStore(
    (state) => state.setAttackStyle,
  );
  const setDefenseStyle = useGameStore(
    (state) => state.setDefenseStyle,
  );
  const setDefensiveLine = useGameStore(
    (state) => state.setDefensiveLine,
  );

  // 초기화 함수
  const clearLineup = useGameStore(
    (state) => state.clearLineup,
  );
  const resetTactics = useGameStore(
    (state) => state.resetTactics,
  );

  // 현재 경기장에 배치된 선수 인원
  const selectedPlayerCount = Object.values(lineup).filter(
    (playerId): playerId is string => Boolean(playerId),
  ).length;

  const startMatch = () => {
    // 11명을 모두 배치하지 않으면 경기 시작 불가
    if (selectedPlayerCount !== 11) {
      return;
    }

    router.push("/match");
  };

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-7xl">
        {/* 페이지 상단 */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
          <div>
            <p className="text-sm font-semibold text-red-400">
              MATCH PREPARATION
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              전술 설정
            </h1>

            <p className="mt-2 text-[var(--muted)]">
              조별리그 1차전 · 대한민국 vs 멕시코
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={clearLineup}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--surface)]"
            >
              선발 비우기
            </button>

            <button
              type="button"
              onClick={resetTactics}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--surface)]"
            >
              전체 초기화
            </button>

            <Link
              href="/"
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--surface)]"
            >
              홈으로
            </Link>
          </div>
        </header>

        {/* 전술 보드 + 전술 옵션 */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* 왼쪽: 경기장과 후보 선수 */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  선발 명단
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  후보 선수를 드래그해 포메이션 슬롯에
                  배치하세요.
                </p>
              </div>

              <span className="rounded-full bg-[var(--surface-light)] px-4 py-2 text-sm font-semibold">
                {formation} · {selectedPlayerCount}/11
              </span>
            </div>

            {/* 
              경기장과 후보 선수 목록이 이 컴포넌트 안에
              함께 들어 있습니다.
            */}
            <div className="mt-6">
              <LineupBuilder />
            </div>
          </section>

          {/* 오른쪽: 전술 선택 영역 */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="text-xl font-semibold">
                팀 전술
              </h2>

              <p className="mt-2 text-sm text-[var(--muted)]">
                각 항목을 선택해 경기 운영 방식을
                설정하세요.
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

            {/* 현재 전술 요약 */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <p className="text-sm text-[var(--muted)]">
                현재 전술 요약
              </p>

              <div className="mt-4 space-y-2 text-sm">
                <SummaryRow
                  label="포메이션"
                  value={formation}
                />

                <SummaryRow
                  label="공격"
                  value={attackStyle}
                />

                <SummaryRow
                  label="수비"
                  value={defenseStyle}
                />

                <SummaryRow
                  label="수비 라인"
                  value={defensiveLine}
                />

                <SummaryRow
                  label="선발 인원"
                  value={`${selectedPlayerCount}/11`}
                />
              </div>
            </section>

            <LineupEvaluationCard
              formation={formation}
              lineup={lineup}
            />

            <TeamRatingCard
              formation={formation}
              lineup={lineup}
            />

            <TeamRatingCard
              formation={formation}
              lineup={lineup}
            />

            <MatchPreviewCard
              formation={formation}
              lineup={lineup}
            />

            {/* 상대 분석 */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <p className="text-sm text-[var(--muted)]">
                상대 분석
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                멕시코
              </h2>

              <p className="mt-4 leading-7 text-[var(--muted)]">
                빠른 측면 공격과 적극적인 전방 압박이
                강점입니다. 압박 이후 발생하는 뒷공간을
                공략할 필요가 있습니다.
              </p>
            </section>

            {/* 경기 시작 버튼 */}
            <button
              type="button"
              onClick={startMatch}
              disabled={selectedPlayerCount !== 11}
              className="w-full rounded-xl bg-[var(--primary)] px-6 py-4 font-semibold text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {selectedPlayerCount === 11
                ? "이 전술로 경기 시작"
                : `선발 선수를 배치하세요 (${selectedPlayerCount}/11)`}
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
      <span className="text-sm text-[var(--muted)]">
        {label}
      </span>

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

function SummaryRow({
  label,
  value,
}: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[var(--muted)]">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}