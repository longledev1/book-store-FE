import { create } from "zustand";

interface UIState {
  introFinished: boolean;
  setIntroFinished: (finished: boolean) => void;
  isAISearchOpen: boolean;
  setIsAISearchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  introFinished: false,
  setIntroFinished: (finished) => set({ introFinished: finished }),
  isAISearchOpen: false,
  setIsAISearchOpen: (open) => set({ isAISearchOpen: open }),
}));
