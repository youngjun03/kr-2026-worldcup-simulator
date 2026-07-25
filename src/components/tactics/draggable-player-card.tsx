"use client";

import { useDraggable } from "@dnd-kit/core";

import type { Player } from "@/types/game";

type DraggablePlayerCardProps = {
  player: Player;
  variant?: "bench" | "field";
};

export function DraggablePlayerCard({
  player,
  variant = "bench",
}: DraggablePlayerCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `player-${player.id}`,
    data: {
      type: "player",
      playerId: player.id,
      source: variant,
    },
  });

  const transformStyle = transform
    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    : undefined;

  if (variant === "field") {
    return (
      <button
        ref={setNodeRef}
        type="button"
        {...listeners}
        {...attributes}
        className="flex cursor-grab touch-none flex-col items-center active:cursor-grabbing"
        style={{
          transform: transformStyle,
          opacity: isDragging ? 0.35 : 1,
          zIndex: isDragging ? 50 : 1,
        }}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-red-500 text-sm font-bold text-white shadow-lg">
          {player.name.slice(-2)}
        </span>

        <span className="mt-1 whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
          {player.name}
        </span>
      </button>
    );
  }

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      className="cursor-grab touch-none rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left hover:bg-[var(--surface-light)] active:cursor-grabbing"
      style={{
        transform: transformStyle,
        opacity: isDragging ? 0.35 : 1,
        zIndex: isDragging ? 50 : 1,
      }}
    >
      <p className="font-semibold">{player.name}</p>

      <p className="mt-2 text-xs text-[var(--muted)]">
        {player.positions.join(" · ")}
      </p>
    </button>
  );
}