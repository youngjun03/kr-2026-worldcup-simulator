"use client";

import { useDroppable } from "@dnd-kit/core";

import { KOREA_PLAYERS } from "@/data/players";
import { DraggablePlayerCard } from "@/components/tactics/draggable-player-card";

import type { Lineup } from "@/types/game";

type SquadListProps = {
  lineup: Lineup;
};

export function SquadList({ lineup }: SquadListProps) {
  const selectedPlayerIds = new Set(
    Object.values(lineup).filter(
      (playerId): playerId is string => Boolean(playerId),
    ),
  );

  const availablePlayers = KOREA_PLAYERS.filter(
    (player) => !selectedPlayerIds.has(player.id),
  );

  const { setNodeRef, isOver } = useDroppable({
    id: "bench-zone",
    data: {
      type: "bench",
    },
  });

  return (
    <section
      ref={setNodeRef}
      className={`mt-6 rounded-2xl border p-5 transition ${
        isOver
          ? "border-red-400 bg-red-400/10"
          : "border-[var(--border)] bg-[var(--background)]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">후보 선수</h3>

          <p className="mt-1 text-sm text-[var(--muted)]">
            선수를 경기장 슬롯으로 드래그하세요.
          </p>
        </div>

        <span className="rounded-full bg-[var(--surface-light)] px-3 py-1 text-sm">
          선발 {selectedPlayerIds.size}/11
        </span>
      </div>

      <p className="mt-3 text-xs text-[var(--muted)]">
        경기장 선수를 이 영역으로 다시 드래그하면 선발에서
        제외됩니다.
      </p>

      {availablePlayers.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {availablePlayers.map((player) => (
            <DraggablePlayerCard
              key={player.id}
              player={player}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
          모든 선수가 현재 선발 명단에 포함되어 있습니다.
        </div>
      )}
    </section>
  );
}