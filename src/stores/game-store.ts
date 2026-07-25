import { create } from "zustand";

import {
  createEmptyLineup,
  remapLineup,
} from "@/lib/lineup";

import type {
  AttackStyle,
  DefenseStyle,
  DefensiveLine,
  Formation,
  Lineup,
} from "@/types/game";

type GameState = {
  formation: Formation;
  attackStyle: AttackStyle;
  defenseStyle: DefenseStyle;
  defensiveLine: DefensiveLine;
  lineup: Lineup;

  setFormation: (formation: Formation) => void;
  setAttackStyle: (attackStyle: AttackStyle) => void;
  setDefenseStyle: (defenseStyle: DefenseStyle) => void;
  setDefensiveLine: (defensiveLine: DefensiveLine) => void;

  assignPlayer: (slotId: string, playerId: string) => void;
  removePlayer: (playerId: string) => void;
  clearLineup: () => void;
  resetTactics: () => void;
};

const DEFAULT_FORMATION: Formation = "4-3-3";

export const useGameStore = create<GameState>((set) => ({
  formation: DEFAULT_FORMATION,
  attackStyle: "빠른 역습",
  defenseStyle: "중간 블록",
  defensiveLine: "보통",

  lineup: createEmptyLineup(DEFAULT_FORMATION),

  setFormation: (nextFormation) => {
    set((state) => ({
      formation: nextFormation,
      lineup: remapLineup(
        state.formation,
        nextFormation,
        state.lineup,
      ),
    }));
  },

  setAttackStyle: (attackStyle) => {
    set({ attackStyle });
  },

  setDefenseStyle: (defenseStyle) => {
    set({ defenseStyle });
  },

  setDefensiveLine: (defensiveLine) => {
    set({ defensiveLine });
  },

  assignPlayer: (slotId, playerId) => {
    set((state) => {
      if (!(slotId in state.lineup)) {
        return {};
      }

      const nextLineup = { ...state.lineup };

      /*
       * 한 선수가 경기장 두 곳에 동시에 배치되지 않도록
       * 기존 위치에서 먼저 제거합니다.
       */
      for (const currentSlotId of Object.keys(nextLineup)) {
        if (nextLineup[currentSlotId] === playerId) {
          nextLineup[currentSlotId] = null;
        }
      }

      /*
       * 대상 슬롯에 기존 선수가 있으면 그 선수는 자동으로
       * 후보 명단으로 내려갑니다.
       */
      nextLineup[slotId] = playerId;

      return {
        lineup: nextLineup,
      };
    });
  },

  removePlayer: (playerId) => {
    set((state) => {
      const nextLineup = { ...state.lineup };

      for (const slotId of Object.keys(nextLineup)) {
        if (nextLineup[slotId] === playerId) {
          nextLineup[slotId] = null;
        }
      }

      return {
        lineup: nextLineup,
      };
    });
  },

  clearLineup: () => {
    set((state) => ({
      lineup: createEmptyLineup(state.formation),
    }));
  },

  resetTactics: () => {
    set({
      formation: DEFAULT_FORMATION,
      attackStyle: "빠른 역습",
      defenseStyle: "중간 블록",
      defensiveLine: "보통",
      lineup: createEmptyLineup(DEFAULT_FORMATION),
    });
  },
}));