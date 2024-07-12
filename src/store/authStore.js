import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: (() => {
    const userInfo = localStorage.getItem("user-info");
    try {
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error("Failed to parse user info from localStorage:", error);
      return null;
    }
  })(),
  login: (user) => {
    localStorage.setItem("user-info", JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("user-info");
    set({ user: null });
  },
  setUser: (user) => {
    localStorage.setItem("user-info", JSON.stringify(user));
    set({ user });
  },
}));

export default useAuthStore;
