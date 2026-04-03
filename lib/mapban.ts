// ============================================================
// MAP BAN ENGINE — Pure functions, decoupled from UI
// ============================================================

import {
  MatchFormat,
  MapBanStep,
  MapBanState,
  PickedMap,
  Side,
} from "@/types";

// ── Veto sequences ────────────────────────────────────────────────────────────

function getMD1Steps(): Omit<MapBanStep, "completed">[] {
  return [
    { step: 1, teamId: "A", actionType: "ban",  description: "Time A bane 1 mapa" },
    { step: 2, teamId: "B", actionType: "ban",  description: "Time B bane 1 mapa" },
    { step: 3, teamId: "A", actionType: "ban",  description: "Time A bane 1 mapa" },
    { step: 4, teamId: "B", actionType: "ban",  description: "Time B bane 1 mapa" },
    { step: 5, teamId: "A", actionType: "ban",  description: "Time A bane 1 mapa" },
    { step: 6, teamId: "B", actionType: "pick", description: "Time B escolhe o mapa 1" },
    { step: 7, teamId: "A", actionType: "side", description: "Time A escolhe o lado no mapa 1" },
  ];
}

function getMD3Steps(): Omit<MapBanStep, "completed">[] {
  return [
    { step: 1, teamId: "A", actionType: "ban",  description: "Time A bane 1 mapa" },
    { step: 2, teamId: "B", actionType: "ban",  description: "Time B bane 1 mapa" },
    { step: 3, teamId: "A", actionType: "pick", description: "Time A escolhe o mapa 1" },
    { step: 4, teamId: "B", actionType: "side", description: "Time B escolhe o lado no mapa 1" },
    { step: 5, teamId: "B", actionType: "pick", description: "Time B escolhe o mapa 2" },
    { step: 6, teamId: "A", actionType: "side", description: "Time A escolhe o lado no mapa 2" },
    { step: 7, teamId: "A", actionType: "ban",  description: "Time A bane 1 mapa" },
    { step: 8, teamId: "B", actionType: "ban",  description: "Time B bane 1 mapa" },
    { step: 9, teamId: "A", actionType: "side", description: "Mapa 3 é o decider — Time A escolhe o lado" },
  ];
}

function getMD5Steps(): Omit<MapBanStep, "completed">[] {
  return [
    { step:  1, teamId: "A", actionType: "ban",  description: "Time A bane 1 mapa" },
    { step:  2, teamId: "B", actionType: "ban",  description: "Time B bane 1 mapa" },
    { step:  3, teamId: "A", actionType: "pick", description: "Time A escolhe o mapa 1" },
    { step:  4, teamId: "B", actionType: "side", description: "Time B escolhe o lado no mapa 1" },
    { step:  5, teamId: "B", actionType: "pick", description: "Time B escolhe o mapa 2" },
    { step:  6, teamId: "A", actionType: "side", description: "Time A escolhe o lado no mapa 2" },
    { step:  7, teamId: "A", actionType: "pick", description: "Time A escolhe o mapa 3" },
    { step:  8, teamId: "B", actionType: "side", description: "Time B escolhe o lado no mapa 3" },
    { step:  9, teamId: "B", actionType: "pick", description: "Time B escolhe o mapa 4" },
    { step: 10, teamId: "A", actionType: "side", description: "Time A escolhe o lado no mapa 4" },
    { step: 11, teamId: "B", actionType: "side", description: "Mapa 5 é o decider — Time B escolhe o lado" },
  ];
}

function getStepsForFormat(format: MatchFormat): Omit<MapBanStep, "completed">[] {
  switch (format) {
    case "MD1": return getMD1Steps();
    case "MD3": return getMD3Steps();
    case "MD5": return getMD5Steps();
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

export function initMapBanState(format: MatchFormat, mapPool: string[]): MapBanState {
  const rawSteps = getStepsForFormat(format);
  const steps: MapBanStep[] = rawSteps.map((s) => ({ ...s, completed: false }));
  return {
    currentStep: 1,
    steps,
    bannedMaps: [],
    pickedMaps: [],
    remainingMaps: [...mapPool],
    completed: false,
    currentAction: steps[0],
    history: [],
  };
}

// ── Process ban ───────────────────────────────────────────────────────────────
// actorTeam is validated against the current step — wrong actor returns state unchanged

export function processBan(
  state: MapBanState,
  mapId: string,
  actorTeam: "A" | "B"
): MapBanState {
  const current = state.steps.find((s) => s.step === state.currentStep);
  if (!current || current.actionType !== "ban") return state;
  // ── engine-level permission guard ──
  if (current.teamId !== actorTeam) return state;
  if (!state.remainingMaps.includes(mapId)) return state;

  const updatedSteps = state.steps.map((s) =>
    s.step === state.currentStep ? { ...s, completed: true, mapId } : s
  );

  const newHistory = [
    ...state.history,
    {
      step: current.step,
      teamId: current.teamId,
      actionType: "ban" as const,
      mapId,
      description: current.description,
    },
  ];

  return advanceStep(
    checkForDecider({
      ...state,
      steps: updatedSteps,
      bannedMaps: [...state.bannedMaps, mapId],
      remainingMaps: state.remainingMaps.filter((m) => m !== mapId),
      history: newHistory,
    })
  );
}

// ── Process pick ──────────────────────────────────────────────────────────────

export function processPick(
  state: MapBanState,
  mapId: string,
  actorTeam: "A" | "B"
): MapBanState {
  const current = state.steps.find((s) => s.step === state.currentStep);
  if (!current || current.actionType !== "pick") return state;
  // ── engine-level permission guard ──
  if (current.teamId !== actorTeam) return state;
  if (!state.remainingMaps.includes(mapId)) return state;

  const newPicked: PickedMap = {
    mapId,
    pickedBy: current.teamId,
    order: state.pickedMaps.length + 1,
  };

  const updatedSteps = state.steps.map((s) =>
    s.step === state.currentStep ? { ...s, completed: true, mapId } : s
  );

  const newHistory = [
    ...state.history,
    {
      step: current.step,
      teamId: current.teamId,
      actionType: "pick" as const,
      mapId,
      description: current.description,
    },
  ];

  return advanceStep(
    checkForDecider({
      ...state,
      steps: updatedSteps,
      pickedMaps: [...state.pickedMaps, newPicked],
      remainingMaps: state.remainingMaps.filter((m) => m !== mapId),
      history: newHistory,
    })
  );
}

// ── Process side choice ───────────────────────────────────────────────────────

export function processSideChoice(
  state: MapBanState,
  side: Side,
  actorTeam: "A" | "B"
): MapBanState {
  const current = state.steps.find((s) => s.step === state.currentStep);
  if (!current || current.actionType !== "side") return state;
  // ── engine-level permission guard ──
  if (current.teamId !== actorTeam) return state;

  const pickedMapsCopy = [...state.pickedMaps];

  // ── Always assign to the FIRST picked map that still lacks a side ──────────
  // (Using findIndex, not reduceRight, to correctly handle decider maps added
  //  mid-sequence in MD5 where picks and their side-steps are interleaved.)
  const targetIndex = pickedMapsCopy.findIndex((pm) => !pm.side);
  if (targetIndex === -1) return state;

  pickedMapsCopy[targetIndex] = {
    ...pickedMapsCopy[targetIndex],
    side,
    sideChosenBy: current.teamId,
  };

  const updatedSteps = state.steps.map((s) =>
    s.step === state.currentStep ? { ...s, completed: true, side } : s
  );

  const newHistory = [
    ...state.history,
    {
      step: current.step,
      teamId: current.teamId,
      actionType: "side" as const, // was incorrectly "pick" before
      side,
      description: `${current.description}: ${side}`,
    },
  ];

  return advanceStep({
    ...state,
    steps: updatedSteps,
    pickedMaps: pickedMapsCopy,
    history: newHistory,
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Automatically claims the last remaining map as the decider when all explicit
 * picks have been made but the series still needs one more game.
 *
 * Uses the number of "side" steps to determine total maps needed — no format
 * parameter required.  Called after EVERY ban and pick so the decider is added
 * as soon as the remaining pool shrinks to 1.
 */
function checkForDecider(state: MapBanState): MapBanState {
  // Total maps in the series = total "side" steps (one per map played)
  const totalMaps = state.steps.filter((s) => s.actionType === "side").length;

  if (state.remainingMaps.length === 1 && state.pickedMaps.length < totalMaps) {
    const deciderId = state.remainingMaps[0];
    const decider: PickedMap = {
      mapId: deciderId,
      pickedBy: "decider",
      order: state.pickedMaps.length + 1,
    };
    return {
      ...state,
      pickedMaps: [...state.pickedMaps, decider],
      remainingMaps: [],
    };
  }
  return state;
}

function advanceStep(state: MapBanState): MapBanState {
  const nextStep = state.currentStep + 1;
  const nextAction = state.steps.find((s) => s.step === nextStep);

  if (!nextAction) {
    return { ...state, completed: true, currentAction: undefined };
  }

  return { ...state, currentStep: nextStep, currentAction: nextAction };
}

// ── Exported helpers ──────────────────────────────────────────────────────────

export function getCurrentTeamLabel(teamId: "A" | "B"): string {
  return teamId === "A" ? "Time A" : "Time B";
}

export function getStepActionLabel(actionType: MapBanStep["actionType"]): string {
  switch (actionType) {
    case "ban":     return "Banir";
    case "pick":    return "Escolher Mapa";
    case "side":    return "Escolher Lado";
    case "decider": return "Decider";
  }
}
