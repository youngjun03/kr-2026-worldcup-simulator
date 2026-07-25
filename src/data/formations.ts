import type { Formation, FormationSlot } from "@/types/game";

export const FORMATION_SLOTS: Record<Formation, FormationSlot[]> = {
  "4-3-3": [
    { id: "gk", role: "GK", x: 50, y: 90 },

    { id: "lb", role: "LB", x: 15, y: 73 },
    { id: "lcb", role: "CB", x: 38, y: 77 },
    { id: "rcb", role: "CB", x: 62, y: 77 },
    { id: "rb", role: "RB", x: 85, y: 73 },

    { id: "dm", role: "DM", x: 50, y: 58 },
    { id: "lcm", role: "CM", x: 31, y: 47 },
    { id: "rcm", role: "CM", x: 69, y: 47 },

    { id: "lw", role: "LW", x: 18, y: 25 },
    { id: "st", role: "ST", x: 50, y: 17 },
    { id: "rw", role: "RW", x: 82, y: 25 },
  ],

  "4-2-3-1": [
    { id: "gk", role: "GK", x: 50, y: 90 },

    { id: "lb", role: "LB", x: 15, y: 73 },
    { id: "lcb", role: "CB", x: 38, y: 77 },
    { id: "rcb", role: "CB", x: 62, y: 77 },
    { id: "rb", role: "RB", x: 85, y: 73 },

    { id: "ldm", role: "DM", x: 38, y: 57 },
    { id: "rdm", role: "DM", x: 62, y: 57 },

    { id: "lw", role: "LW", x: 18, y: 35 },
    { id: "am", role: "AM", x: 50, y: 38 },
    { id: "rw", role: "RW", x: 82, y: 35 },

    { id: "st", role: "ST", x: 50, y: 17 },
  ],

  "3-4-3": [
    { id: "gk", role: "GK", x: 50, y: 90 },

    { id: "lcb", role: "CB", x: 27, y: 75 },
    { id: "cb", role: "CB", x: 50, y: 79 },
    { id: "rcb", role: "CB", x: 73, y: 75 },

    { id: "lwb", role: "LWB", x: 12, y: 51 },
    { id: "lcm", role: "CM", x: 39, y: 54 },
    { id: "rcm", role: "CM", x: 61, y: 54 },
    { id: "rwb", role: "RWB", x: 88, y: 51 },

    { id: "lw", role: "LW", x: 19, y: 25 },
    { id: "st", role: "ST", x: 50, y: 17 },
    { id: "rw", role: "RW", x: 81, y: 25 },
  ],
};