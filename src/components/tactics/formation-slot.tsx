"use client";

import { useDroppable } from "@dnd-kit/core";

import { PLAYER_BY_ID } from "@/data/players";
import { DraggablePlayerCard } from "@/components/tactics/draggable-player-card";

import type {
  FormationSlot as FormationSlotType,
  Lineup,
} from "@/types/game";

type FormationSlotProps = {
  slot: FormationSlotType;
  lineup: Lineup;
};

export function FormationSlot({
  slot,
  lineup,
}: FormationSlotProps) {
  const playerId = lineup[slot.id];
  const player = playerId ? PLAYER_BY_ID[playerId] : null;

  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${slot.id}`,
    data: {
      type: "slot",
      slotId: slot.id,
      role: slot.role,
    },
  });

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
        className={`flex min-h-20 min-w-20 items-center justify-center rounded-2xl border-2 transition ${
          isOver
            ? "scale-110 border-red-400 bg-red-400/25"
            : player
              ? "border-transparent"
              : "border-dashed border-white/35 bg-white/5"
        }`}
      >
        {player ? (
          <DraggablePlayerCard
            player={player}
            variant="field"
          />
        ) : (
          <div className="text-center text-white/55">
            <p className="text-sm font-bold">{slot.role}</p>
            <p className="mt-1 text-[10px]">선수 배치</p>
          </div>
        )}
      </div>
    </div>
  );
}