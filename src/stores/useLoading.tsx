import { create } from "zustand";

interface UseLoading {
  isLoading: boolean,
  setLoading: (val: boolean) => void,
}

export const useLoading = create<UseLoading>((set) => (
  {
    isLoading: false,
    setLoading: (val: boolean) => {
      set({
        isLoading: val
      })
    }
  }
))