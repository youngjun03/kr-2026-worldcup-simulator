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

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted)]">
            포지션 배치
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            선수 적합도
          </h2>
        </div>

        <span className="rounded-full bg-[var(--surface-light)] px-3 py-1 text-sm font-semibold">
          {evaluation.selectedCount}/11
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Metric
          label="적합"
          value={`${evaluation.fitCount}명`}
          description="능력 100%"
        />

        <Metric
          label="가능"
          value={`${evaluation.possibleCount}명`}
          description="능력 97%"
        />

        <Metric
          label="부적합"
          value={`${evaluation.unsuitableCount}명`}
          description="능력 90%"
        />
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
        <span className="text-sm text-[var(--muted)]">
          평균 능력 감소
        </span>

        <span className="font-semibold">
          -{evaluation.averageReduction}%
        </span>
      </div>

      <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
        선수 개인 능력치는 배치된 포지션의 적합도에 따라
        조정됩니다. 전술 선택은 이 능력치 계산에 포함되지
        않습니다.
      </p>
    </section>
  );
}

type MetricProps = {
  label: string;
  value: string;
  description: string;
};

function Metric({
  label,
  value,
  description,
}: MetricProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
      <p className="text-xs text-[var(--muted)]">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}