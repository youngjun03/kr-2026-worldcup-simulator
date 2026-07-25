import { FORMATION_SLOTS } from "@/data/formations";
import { PLAYER_BY_ID } from "@/data/players";

import type { Formation } from "@/types/game";

type PitchBoardProps = {
  formation: Formation;
};

export function PitchBoard({ formation }: PitchBoardProps) {
  const slots = FORMATION_SLOTS[formation];

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/20 bg-[#164b2d]">
      <PitchLines />

      <div className="absolute top-3 left-3 rounded-full bg-black/25 px-3 py-1 text-xs text-white/80">
        공격 방향 ↑
      </div>

      {slots.map((slot) => {
        const player = PLAYER_BY_ID[slot.playerId];

        if (!player) {
          return null;
        }

        return (
          <div
            key={slot.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
            }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-red-500 font-bold text-white shadow-lg">
              {player.number}
            </div>

            <div className="mt-1 rounded-md bg-black/65 px-2 py-1 text-center">
              <p className="whitespace-nowrap text-xs font-semibold text-white">
                {player.name}
              </p>

              <p className="mt-0.5 text-[10px] text-white/65">
                {slot.role}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PitchLines() {
  return (
    <div className="pointer-events-none absolute inset-0 text-white/35">
      {/* 외곽선 */}
      <div className="absolute inset-4 border border-current" />

      {/* 중앙선 */}
      <div className="absolute top-1/2 right-4 left-4 border-t border-current" />

      {/* 센터 서클 */}
      <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-current" />

      {/* 센터 스폿 */}
      <div className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />

      {/* 상대 페널티 박스 */}
      <div className="absolute top-4 left-1/2 h-[18%] w-[48%] -translate-x-1/2 border border-current" />

      {/* 상대 골 에어리어 */}
      <div className="absolute top-4 left-1/2 h-[8%] w-[24%] -translate-x-1/2 border border-current" />

      {/* 대한민국 페널티 박스 */}
      <div className="absolute bottom-4 left-1/2 h-[18%] w-[48%] -translate-x-1/2 border border-current" />

      {/* 대한민국 골 에어리어 */}
      <div className="absolute bottom-4 left-1/2 h-[8%] w-[24%] -translate-x-1/2 border border-current" />

      {/* 상대 골대 */}
      <div className="absolute top-2 left-1/2 h-2 w-[16%] -translate-x-1/2 border border-current" />

      {/* 대한민국 골대 */}
      <div className="absolute bottom-2 left-1/2 h-2 w-[16%] -translate-x-1/2 border border-current" />
    </div>
  );
}