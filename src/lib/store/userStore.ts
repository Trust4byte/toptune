import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: null | string;
    total: number;
  };
  href: string;
  id: string;
  images: Array<{
    height: number;
    url: string;
    width: number;
  }>;
  product: string;
  type: string;
  uri: string;
}

interface UserState {
  isAuthenticated: boolean;
  user: User | null;
  setAuthenticated: (isAuth: boolean) => void;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setAuthenticated: (isAuth) => set(() => ({ isAuthenticated: isAuth })),
      setUser: (user) => set(() => ({ user })),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
