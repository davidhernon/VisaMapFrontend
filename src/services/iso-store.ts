import create from 'zustand';

export const isoStore = create<{
  iso: string;
  actions: {
    setIso: (iso: string) => void;
  };
}>((set) => ({
  iso: 'US',
  actions: {
    setIso: (iso: string) => set((state) => ({ iso })),
  },
}));
