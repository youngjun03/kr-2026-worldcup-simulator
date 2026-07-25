import { calculateTeamRating } from "@/lib/team-rating";

import type {
  Formation,
  Lineup,
  PlayerStats,
} from "@/types/game";

type TeamRatingCardProps = {
  formation: Formation;
  lineup: Lineup;
};

const STAT_LABELS: Record<keyof PlayerStats, string> = {
  pace: "속도",
  shooting: "슈팅",
  passing: "패스",
  dribbling: "드리블",
  defending: "수비",
  stamina: "체력",
};

const STAT_KEYS = Object.keys(
  STAT_LABELS,
) as (keyof PlayerStats)[];

export function TeamRatingCard({
  formation,
  lineup,
}: TeamRatingCardProps) {
  const rating = calculateTeamRating(
    formation,
    lineup,
  );

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted)]">
            선수 능력치 기반
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            팀 능력치
          </h2>
        </div>

        <div className="text-right">
          <p className="text-xs text-[var(--muted)]">
            종합
          </p>

          <p className="mt-1 text-3xl font-bold">
            {rating.selectedCount > 0
              ? rating.overall
              : "-"}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {STAT_KEYS.map((statKey) => (
          <RatingRow
            key={statKey}
            label={STAT_LABELS[statKey]}
            value={rating[statKey]}
          />
        ))}
      </div>

      {!rating.isComplete && (
        <p className="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
          현재 {rating.selectedCount}명의 선수만 기준으로
          계산된 임시 능력치입니다. 11명을 배치하면 최종 팀
          능력치가 계산됩니다.
        </p>
      )}
    </section>
  );
}

type RatingRowProps = {
  label: string;
  value: number;
};

function RatingRow({
  label,
  value,
}: RatingRowProps) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--muted)]">
          {label}
        </span>

        <span className="font-semibold">
          {value}
        </span>
      </div>

      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--background)]">
        <div
          className="h-full rounded-full bg-red-400 transition-all"
          style={{
            width: `${Math.max(
              0,
              Math.min(value, 100),
            )}%`,
          }}
        />
      </div>
    </div>
  );
}