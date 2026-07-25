import type { Formation, FormationSlot } from "@/types/game";

export const FORMATION_SLOTS: Record<Formation, FormationSlot[]> = {
  "4-2-3-1": [
    {
      id: "gk",
      role: "GK",
      x: 50,
      y: 90,
      playerId: "jo-hyeon-woo",
    },

    {
      id: "lb",
      role: "LB",
      x: 16,
      y: 72,
      playerId: "lee-tae-seok",
    },
    {
      id: "left-cb",
      role: "CB",
      x: 38,
      y: 76,
      playerId: "kim-min-jae",
    },
    {
      id: "right-cb",
      role: "CB",
      x: 62,
      y: 76,
      playerId: "lee-han-beom",
    },
    {
      id: "rb",
      role: "RB",
      x: 84,
      y: 72,
      playerId: "seol-young-woo",
    },

    {
      id: "left-dm",
      role: "DM",
      x: 38,
      y: 56,
      playerId: "park-yong-woo",
    },
    {
      id: "right-dm",
      role: "CM",
      x: 62,
      y: 56,
      playerId: "hwang-in-beom",
    },

    {
      id: "lw",
      role: "LW",
      x: 18,
      y: 34,
      playerId: "son-heung-min",
    },
    {
      id: "am",
      role: "AM",
      x: 50,
      y: 39,
      playerId: "lee-kang-in",
    },
    {
      id: "rw",
      role: "RW",
      x: 82,
      y: 34,
      playerId: "hwang-hee-chan",
    },

    {
      id: "st",
      role: "ST",
      x: 50,
      y: 16,
      playerId: "cho-gue-sung",
    },
  ],

  "4-3-3": [
    {
      id: "gk",
      role: "GK",
      x: 50,
      y: 90,
      playerId: "jo-hyeon-woo",
    },

    {
      id: "lb",
      role: "LB",
      x: 16,
      y: 72,
      playerId: "lee-tae-seok",
    },
    {
      id: "left-cb",
      role: "CB",
      x: 38,
      y: 76,
      playerId: "kim-min-jae",
    },
    {
      id: "right-cb",
      role: "CB",
      x: 62,
      y: 76,
      playerId: "lee-han-beom",
    },
    {
      id: "rb",
      role: "RB",
      x: 84,
      y: 72,
      playerId: "seol-young-woo",
    },

    {
      id: "dm",
      role: "DM",
      x: 50,
      y: 59,
      playerId: "park-yong-woo",
    },
    {
      id: "left-cm",
      role: "CM",
      x: 32,
      y: 48,
      playerId: "hwang-in-beom",
    },
    {
      id: "right-cm",
      role: "CM",
      x: 68,
      y: 48,
      playerId: "lee-kang-in",
    },

    {
      id: "lw",
      role: "LW",
      x: 18,
      y: 25,
      playerId: "son-heung-min",
    },
    {
      id: "st",
      role: "ST",
      x: 50,
      y: 17,
      playerId: "cho-gue-sung",
    },
    {
      id: "rw",
      role: "RW",
      x: 82,
      y: 25,
      playerId: "hwang-hee-chan",
    },
  ],

  "3-4-3": [
    {
      id: "gk",
      role: "GK",
      x: 50,
      y: 90,
      playerId: "jo-hyeon-woo",
    },

    {
      id: "left-cb",
      role: "CB",
      x: 27,
      y: 74,
      playerId: "kim-min-jae",
    },
    {
      id: "center-cb",
      role: "CB",
      x: 50,
      y: 78,
      playerId: "park-yong-woo",
    },
    {
      id: "right-cb",
      role: "CB",
      x: 73,
      y: 74,
      playerId: "lee-han-beom",
    },

    {
      id: "lwb",
      role: "LWB",
      x: 12,
      y: 51,
      playerId: "lee-tae-seok",
    },
    {
      id: "left-cm",
      role: "CM",
      x: 40,
      y: 53,
      playerId: "hwang-in-beom",
    },
    {
      id: "right-cm",
      role: "CM",
      x: 60,
      y: 53,
      playerId: "lee-kang-in",
    },
    {
      id: "rwb",
      role: "RWB",
      x: 88,
      y: 51,
      playerId: "seol-young-woo",
    },

    {
      id: "lw",
      role: "LW",
      x: 20,
      y: 24,
      playerId: "son-heung-min",
    },
    {
      id: "st",
      role: "ST",
      x: 50,
      y: 16,
      playerId: "cho-gue-sung",
    },
    {
      id: "rw",
      role: "RW",
      x: 80,
      y: 24,
      playerId: "hwang-hee-chan",
    },
  ],
};