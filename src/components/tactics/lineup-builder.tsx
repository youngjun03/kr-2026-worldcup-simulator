"use client";

import {
  DndContext,
  type DragEndEvent,
} from "@dnd-kit/core";

import { PitchBoard } from "@/components/tactics/pitch-board";
import { SquadList } from "@/components/tactics/squad-list";
import { useGameStore } from "@/stores/game-store";

export function LineupBuilder() {
  const formation = useGameStore((state) => state.formation);
  const lineup = useGameStore((state) => state.lineup);

  const assignPlayer = useGameStore(
    (state) => state.assignPlayer,
  );

  const removePlayer = useGameStore(
    (state) => state.removePlayer,
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const playerId = active.data.current?.playerId;

    if (typeof playerId !== "string") {
      return;
    }

    const targetType = over.data.current?.type;

    if (targetType === "slot") {
      const slotId = over.data.current?.slotId;

      if (typeof slotId === "string") {
        assignPlayer(slotId, playerId);
      }

      return;
    }

    if (targetType === "bench") {
      removePlayer(playerId);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <PitchBoard
        formation={formation}
        lineup={lineup}
      />

      <SquadList lineup={lineup} />
    </DndContext>
  );
}