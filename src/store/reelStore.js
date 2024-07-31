import { create } from "zustand";

const useReelstore = create((set) => ({
	reels: [],
	createReel: (reel) => set((state) => ({ reels: [reel, ...state.reels] })),
	deletePost: (id) => set((state) => ({ reels: state.reels.filter((reel) => reel.id !== id) })),
	setreels: (reels) => set({ reels }),
	addComment: (reelId, comment) =>
		set((state) => ({
			reels: state.reels.map((reel) => {
				if (reel.id === reelId) {
					return {
						...reel,
						comments: [...reel.comments, comment],
					};
				}
				return reel;
			}),
		})),
}));

export default useReelstore;
