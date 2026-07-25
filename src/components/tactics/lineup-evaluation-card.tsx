import { evaluateLineup } from "@/lib/lineup";

import type {
  Formation,
  Lineup,
} from "@/types/game";

type LineupEvaluationCardProps = {
  formation: Formation;
  lineup: Lineup;
};

export function LineupEvaluationCard({
  formation,
  lineup,
}: LineupEvaluationCardProps) {
  const evaluation = evaluateLineup(
    formation,
    lineup,
  );

  const isComplete =
    evaluation.selectedCount === 11;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted)]">
            포지션 적합도
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            전술 적합도 분석
          </h2>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            isComplete
              ? "bg-emerald-400/15 text-emerald-200"
              : "bg-amber-400/15 text-amber-200"
          }`}
        >
          {evaluation.selectedCount}/11
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Metric
          label="평균 적합도"
          value={
            evaluation.selectedCount > 0
              ? `${evaluation.averageFit}`
              : "-"
          }
        />

        <Metric
          label="전술 페널티"
          value={
            evaluation.selectedCount > 0
              ? `-${evaluation.tacticalPenalty}%`
              : "-"
          }
        />

        <Metric
          label="부적합 선수"
          value={`${evaluation.outOfPositionCount}명`}
        />
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted)]">
            포지션 조화
          </span>

          <span className="font-semibold">
            {evaluation.averageFit}/100
          </span>
        </div>

        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--background)]">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all"
            style={{
              width: `${evaluation.averageFit}%`,
            }}
          />
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
        {evaluation.selectedCount === 0
          ? "선수를 포메이션 슬롯에 배치하면 적합도를 계산합니다."
          : evaluation.outOfPositionCount > 0
            ? "포지션이 맞지 않는 선수가 있습니다. 해당 선수는 경기 시 능력치 감소가 적용됩니다."
            : evaluation.tacticalPenalty > 0
              ? "모든 선수가 포지션을 소화할 수 있지만 일부 선수에게 소폭의 능력치 감소가 적용됩니다."
              : "모든 선수가 자신의 최적 포지션에 배치되어 있습니다."}
      </p>
    </section>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({
  label,
  value,
}: MetricProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
      <p className="text-xs text-[var(--muted)]">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold">
        {value}
      </p>
    </div>
  );
}