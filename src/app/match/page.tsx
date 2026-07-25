"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
} from "react";

import { MEXICO } from "@/data/opponents";
import { createEventCommentary } from "@/lib/commentary";
import { calculateMatchMetrics } from "@/lib/match-rating";
import { simulateMatchSegment } from "@/lib/match-simulator";
import { useGameStore } from "@/stores/game-store";

import type {
  MatchEvent,
  MatchState,
} from "@/types/match";

const MATCH_SEED = 20260726;

const INITIAL_MATCH_STATE: MatchState = {
  currentMinute: 0,
  homeScore: 0,
  awayScore: 0,
  eventIndex: 0,
};

export default function MatchPage() {
  const formation = useGameStore(
    (state) => state.formation,
  );

  const attackStyle = useGameStore(
    (state) => state.attackStyle,
  );

  const defenseStyle = useGameStore(
    (state) => state.defenseStyle,
  );

  const defensiveLine = useGameStore(
    (state) => state.defensiveLine,
  );

  const lineup = useGameStore(
    (state) => state.lineup,
  );

  const [matchState, setMatchState] =
    useState<MatchState>(
      INITIAL_MATCH_STATE,
    );

  const [events, setEvents] = useState<
    MatchEvent[]
  >([]);

  const koreaMetrics = useMemo(
    () =>
      calculateMatchMetrics(
        formation,
        lineup,
      ),
    [formation, lineup],
  );

  const advanceMatch = () => {
    if (
      matchState.currentMinute >= 90 ||
      !koreaMetrics.isComplete
    ) {
      return;
    }

    const segmentStart =
      matchState.currentMinute + 1;

    const segmentEnd = Math.min(
      matchState.currentMinute + 5,
      90,
    );

    const result = simulateMatchSegment({
      seed: MATCH_SEED,

      segmentStart,
      segmentEnd,

      state: matchState,

      formation,
      lineup,

      tactics: {
        attackStyle,
        defenseStyle,
        defensiveLine,
      },

      opponent: MEXICO,
    });

    setMatchState(result.state);

    setEvents((currentEvents) => [
      ...currentEvents,
      ...result.events,
    ]);
  };

  const resetMatch = () => {
    setMatchState(
      INITIAL_MATCH_STATE,
    );

    setEvents([]);
  };

  const matchFinished =
    matchState.currentMinute >= 90;

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="text-center">
          <p className="text-sm font-semibold text-red-400">
            GROUP STAGE · MATCHDAY 1
          </p>

          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-6">
            <div>
              <p className="text-4xl">
                🇰🇷
              </p>

              <p className="mt-2 text-xl font-semibold">
                대한민국
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)]">
                {getMatchTimeText(
                  matchState.currentMinute,
                )}
              </p>

              <p className="mt-2 text-5xl font-bold">
                {matchState.homeScore}
                {" : "}
                {matchState.awayScore}
              </p>
            </div>

            <div>
              <p className="text-4xl">
                {MEXICO.flag}
              </p>

              <p className="mt-2 text-xl font-semibold">
                {MEXICO.name}
              </p>
            </div>
          </div>
        </header>

        {!koreaMetrics.isComplete && (
          <section className="mt-8 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5">
            <p className="font-semibold text-amber-100">
              선발 명단이 완성되지 않았습니다.
            </p>

            <p className="mt-2 text-sm text-amber-100/75">
              현재 {koreaMetrics.selectedCount}/11명이
              배치되어 있습니다.
            </p>

            <Link
              href="/tactics"
              className="mt-4 inline-block rounded-lg border border-amber-300/40 px-4 py-2 text-sm"
            >
              전술 화면으로 돌아가기
            </Link>
          </section>
        )}

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-red-400">
                  LIVE
                </p>

                <h1 className="mt-1 text-2xl font-bold">
                  라디오 중계
                </h1>
              </div>

              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--muted)]">
                Seed {MATCH_SEED}
              </span>
            </div>

            {events.length === 0 ? (
              <div className="mt-7 rounded-xl border border-dashed border-[var(--border)] p-10 text-center">
                <p className="font-semibold">
                  경기 시작 전입니다.
                </p>

                <p className="mt-2 text-sm text-[var(--muted)]">
                  다음 5분 진행 버튼을 누르면 경기 이벤트가
                  생성됩니다.
                </p>
              </div>
            ) : (
              <div className="mt-7 space-y-4">
                {events.map((event) => {
                  const commentary =
                    createEventCommentary(
                      event,
                      MEXICO.name,
                    );

                  return (
                    <article
                      key={event.id}
                      className={`rounded-xl border p-5 ${
                        event.type === "goal"
                          ? "border-red-500/60 bg-red-500/10"
                          : event.type === "save"
                            ? "border-sky-400/40 bg-sky-400/10"
                            : "border-[var(--border)] bg-[var(--background)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold text-red-400">
                          {event.minute}′
                        </p>

                        <span className="text-xs text-[var(--muted)]">
                          {event.homeScore}
                          {" : "}
                          {event.awayScore}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1">
                        {commentary.map(
                          (sentence) => (
                            <p
                              key={sentence}
                              className="leading-7"
                            >
                              {sentence}
                            </p>
                          ),
                        )}
                      </div>

                      <details className="mt-4">
                        <summary className="cursor-pointer text-xs text-[var(--muted)]">
                          이벤트 생성 이유
                        </summary>

                        <ul className="mt-3 space-y-1 text-xs text-[var(--muted)]">
                          {event.reasons.map(
                            (reason) => (
                              <li key={reason}>
                                · {reason}
                              </li>
                            ),
                          )}
                        </ul>
                      </details>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h2 className="font-semibold">
                시뮬레이션 상태
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <StatusRow
                  label="진행 시간"
                  value={`${matchState.currentMinute}/90분`}
                />

                <StatusRow
                  label="생성 이벤트"
                  value={`${events.length}개`}
                />

                <StatusRow
                  label="한국 종합"
                  value={`${koreaMetrics.overall}`}
                />

                <StatusRow
                  label="멕시코 종합"
                  value={`${MEXICO.metrics.overall}`}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-sm text-[var(--muted)]">
                현재 전술
              </p>

              <p className="mt-2 font-semibold">
                {attackStyle}
                {" · "}
                {defenseStyle}
              </p>

              <div className="mt-4 space-y-2 text-sm">
                <StatusRow
                  label="포메이션"
                  value={formation}
                />

                <StatusRow
                  label="수비 라인"
                  value={defensiveLine}
                />
              </div>
            </section>

            {!matchFinished ? (
              <button
                type="button"
                onClick={advanceMatch}
                disabled={
                  !koreaMetrics.isComplete
                }
                className="w-full rounded-xl bg-[var(--primary)] px-5 py-4 font-semibold text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                다음 5분 진행
              </button>
            ) : (
              <Link
                href="/result"
                className="block rounded-xl bg-[var(--primary)] px-5 py-4 text-center font-semibold text-white hover:bg-[var(--primary-hover)]"
              >
                경기 결과 확인
              </Link>
            )}

            <button
              type="button"
              onClick={resetMatch}
              className="w-full rounded-xl border border-[var(--border)] px-5 py-3 text-sm hover:bg-[var(--surface)]"
            >
              경기 다시 시작
            </button>

            <Link
              href="/tactics"
              className="block text-center text-sm text-[var(--muted)] hover:text-white"
            >
              전술 화면으로 돌아가기
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}

type StatusRowProps = {
  label: string;
  value: string;
};

function StatusRow({
  label,
  value,
}: StatusRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[var(--muted)]">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}

function getMatchTimeText(
  minute: number,
): string {
  if (minute === 0) {
    return "경기 전";
  }

  if (minute === 45) {
    return "하프타임";
  }

  if (minute >= 90) {
    return "경기 종료";
  }

  if (minute < 45) {
    return `전반 ${minute}분`;
  }

  return `후반 ${minute}분`;
}