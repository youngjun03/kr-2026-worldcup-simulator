import { create } from "zustand";

import type {
  AttackStyle,
  DefenseStyle,
  DefensiveLine,
  Formation,
} from "@/types/game";

type GameState = {
  formation: Formation;
  attackStyle: AttackStyle;
  defenseStyle: DefenseStyle;
  defensiveLine: DefensiveLine;

  setFormation: (formation: Formation) => void;
  setAttackStyle: (attackStyle: AttackStyle) => void;
  setDefenseStyle: (defenseStyle: DefenseStyle) => void;
  setDefensiveLine: (defensiveLine: DefensiveLine) => void;

  resetTactics: () => void;
};

const initialTactics = {
  formation: "4-2-3-1" as Formation,
  attackStyle: "빠른 역습" as AttackStyle,
  defenseStyle: "중간 블록" as DefenseStyle,
  defensiveLine: "보통" as DefensiveLine,
};

export const useGameStore = create<GameState>((set) => ({
  ...initialTactics,

  setFormation: (formation) => {
    set({ formation });
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

  resetTactics: () => {
    set(initialTactics);
  },
}));