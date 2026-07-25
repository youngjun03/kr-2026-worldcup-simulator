"use client";

import { useDroppable } from "@dnd-kit/core";

import { DraggablePlayerCard } from "@/components/tactics/draggable-player-card";
import { PLAYER_BY_ID } from "@/data/players";
import {
  getPositionFit,
  type PositionFitLevel,
} from "@/lib/lineup";

import type {
  FormationSlot as FormationSlotType,
  Lineup,
} from "@/types/game";

type FormationSlotProps = {
  slot: FormationSlotType;
  lineup: Lineup;
};

const SLOT_STYLE: Record<PositionFitLevel, string> = {
  perfect:
    "border-emerald-400/70 bg-emerald-400/10",
  good:
    "border-cyan-400/70 bg-cyan-400/10",
  possible:
    "border-amber-400/70 bg-amber-400/10",
  poor:
    "border-red-500/80 bg-red-500/15",
};

const BADGE_STYLE: Record<PositionFitLevel, string> = {
  perfect:
    "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
  good:
    "border-cyan-400/40 bg-cyan-400/15 text-cyan-200",
  possible:
    "border-amber-400/40 bg-amber-400/15 text-amber-200",
  poor:
    "border-red-500/50 bg-red-500/20 text-red-200",
};

export function FormationSlot({
  slot,
  lineup,
}: FormationSlotProps) {
  const playerId = lineup[slot.id];
  const player = playerId
    ? PLAYER_BY_ID[playerId]
    : null;

  const fit = player
    ? getPositionFit(player.positions, slot.role)
    : null;

  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${slot.id}`,
    data: {
      type: "slot",
      slotId: slot.id,
      role: slot.role,
    },
  });

  const slotStyle = isOver
    ? "scale-110 border-white bg-white/20"
    : fit
      ? SLOT_STYLE[fit.level]
      : "border-dashed border-white/35 bg-white/5";

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
      }}
    >
      <div
        ref={setNodeRef}
        className={`flex min-h-20 min-w-20 items-center justify-center rounded-2xl border-2 transition ${slotStyle}`}
      >
        {player ? (
          <div className="flex flex-col items-center">
            <DraggablePlayerCard
              player={player}
              variant="field"
            />

            {fit && (
              <span
                className={`mt-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold ${BADGE_STYLE[fit.level]}`}
              >
                {slot.role} · {fit.label}
              </span>
            )}
          </div>
        ) : (
          <div className="text-center text-white/55">
            <p className="text-sm font-bold">
              {slot.role}
            </p>

            <p className="mt-1 text-[10px]">
              선수 배치
            </p>
          </div>
        )}
      </div>
    </div>
  );
}