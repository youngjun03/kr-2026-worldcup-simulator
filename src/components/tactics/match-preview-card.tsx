import { MEXICO } from "@/data/opponents";
import { calculateMatchMetrics } from "@/lib/match-rating";

import type {
  Formation,
  Lineup,
} from "@/types/game";
import type { MatchMetrics } from "@/types/match";

type MatchPreviewCardProps = {
  formation: Formation;
  lineup: Lineup;
};

const METRIC_LABELS: Record<
  keyof Omit<MatchMetrics, "overall">,
  string
> = {
  attack: "공격",
  midfield: "중원",
  defense: "수비",
  pressing: "압박",
  transition: "공격 전환",
  chanceCreation: "기회 창출",
  goalkeeping: "골키퍼",
};

const METRIC_KEYS = Object.keys(
  METRIC_LABELS,
) as Array<keyof Omit<MatchMetrics, "overall">>;

export function MatchPreviewCard({
  formation,
  lineup,
}: MatchPreviewCardProps) {
  const korea = calculateMatchMetrics(
    formation,
    lineup,
  );

  const opponent = MEXICO;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted)]">
            경기력 비교
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            대한민국 vs {opponent.name}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <OverallBadge
            label="한국"
            value={korea.overall}
          />

          <span className="text-sm text-[var(--muted)]">
            VS
          </span>

          <OverallBadge
            label={opponent.name}
            value={opponent.metrics.overall}
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {METRIC_KEYS.map((metricKey) => (
          <ComparisonRow
            key={metricKey}
            label={METRIC_LABELS[metricKey]}
            koreaValue={korea[metricKey]}
            opponentValue={
              opponent.metrics[metricKey]
            }
          />
        ))}
      </div>

      {!korea.isComplete && (
        <p className="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
          현재 {korea.selectedCount}명만 배치되어 있어 대한민국
          지표는 임시값입니다. 선발 11명을 모두 배치하면 최종
          경기력이 계산됩니다.
        </p>
      )}

      <div className="mt-6 border-t border-[var(--border)] pt-5">
        <p className="text-sm font-semibold">
          상대 전술
        </p>

        <p className="mt-2 text-sm text-[var(--muted)]">
          {opponent.tactics.attackStyle}
          {" · "}
          {opponent.tactics.defenseStyle}
          {" · 수비 라인 "}
          {opponent.tactics.defensiveLine}
        </p>
      </div>
    </section>
  );
}

type OverallBadgeProps = {
  label: string;
  value: number;
};

function OverallBadge({
  label,
  value,
}: OverallBadgeProps) {
  return (
    <div className="text-center">
      <p className="text-xs text-[var(--muted)]">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value || "-"}
      </p>
    </div>
  );
}

type ComparisonRowProps = {
  label: string;
  koreaValue: number;
  opponentValue: number;
};

function ComparisonRow({
  label,
  koreaValue,
  opponentValue,
}: ComparisonRowProps) {
  const total = koreaValue + opponentValue;

  const koreaWidth =
    total > 0
      ? (koreaValue / total) * 100
      : 50;

  const opponentWidth = 100 - koreaWidth;

  const koreaIsHigher =
    koreaValue > opponentValue;

  const opponentIsHigher =
    opponentValue > koreaValue;

  return (
    <div>
      <div className="grid grid-cols-[45px_1fr_45px] items-center gap-3 text-sm">
        <span
          className={
            koreaIsHigher
              ? "font-semibold text-emerald-300"
              : "font-semibold"
          }
        >
          {koreaValue}
        </span>

        <span className="text-center text-[var(--muted)]">
          {label}
        </span>

        <span
          className={`text-right ${
            opponentIsHigher
              ? "font-semibold text-emerald-300"
              : "font-semibold"
          }`}
        >
          {opponentValue}
        </span>
      </div>

      <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-[var(--background)]">
        <div
          className="h-full bg-red-400 transition-all"
          style={{
            width: `${koreaWidth}%`,
          }}
        />

        <div
          className="h-full bg-white/25"
          style={{
            width: `${opponentWidth}%`,
          }}
        />
      </div>
    </div>
  );
}