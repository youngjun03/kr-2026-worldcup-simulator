import { FORMATION_SLOTS } from "@/data/formations";
import { FormationSlot } from "@/components/tactics/formation-slot";

import type {
  Formation,
  Lineup,
} from "@/types/game";

type PitchBoardProps = {
  formation: Formation;
  lineup: Lineup;
};

export function PitchBoard({
  formation,
  lineup,
}: PitchBoardProps) {
  const slots = FORMATION_SLOTS[formation];

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/20 bg-[#164b2d]">
      <PitchLines />

      <div className="absolute top-3 left-3 rounded-full bg-black/30 px-3 py-1 text-xs text-white/75">
        공격 방향 ↑
      </div>

      {slots.map((slot) => (
        <FormationSlot
          key={slot.id}
          slot={slot}
          lineup={lineup}
        />
      ))}
    </div>
  );
}

function PitchLines() {
  return (
    <div className="pointer-events-none absolute inset-0 text-white/30">
      <div className="absolute inset-4 border border-current" />

      <div className="absolute top-1/2 right-4 left-4 border-t border-current" />

      <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-current" />

      <div className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />

      <div className="absolute top-4 left-1/2 h-[18%] w-[48%] -translate-x-1/2 border border-current" />

      <div className="absolute top-4 left-1/2 h-[8%] w-[24%] -translate-x-1/2 border border-current" />

      <div className="absolute bottom-4 left-1/2 h-[18%] w-[48%] -translate-x-1/2 border border-current" />

      <div className="absolute bottom-4 left-1/2 h-[8%] w-[24%] -translate-x-1/2 border border-current" />

      <div className="absolute top-2 left-1/2 h-2 w-[16%] -translate-x-1/2 border border-current" />

      <div className="absolute bottom-2 left-1/2 h-2 w-[16%] -translate-x-1/2 border border-current" />
    </div>
  );
}