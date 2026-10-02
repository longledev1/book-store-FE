import { create } from "zustand";

interface UnverifiedModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useUnverifiedModalStore = create<UnverifiedModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
