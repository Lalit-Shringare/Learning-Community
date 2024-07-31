import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import PageLayout from "./Layouts/PageLayout/PageLayout";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { useEffect, useState } from "react";
import { useGetFollowers } from "./hooks/useGetFollowers";
import useAuthStore from "./store/authStore";
import { collection, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { firestore } from "./firebase/firebase";
import MessagePage from "./components/Message/MessagePage";
import VideoContainer from "./components/Shorts/VideoContainer";

function App() {
  const [followers, setFollowers] = useState([]);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const { isLoading, refetch: refetchFollowers } = useGetFollowers();
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!authUser) return;

    const unsubscribeArray = [];

    const setupRealTimeListeners = async () => {
      // Fetch initial followers
      const fetchedFollowers = await refetchFollowers();
      const followersWithUnreadCounts = await addUnreadMessageCounts(fetchedFollowers);
      setFollowers(followersWithUnreadCounts);

      // Set total unread count
      setTotalUnreadCount(followersWithUnreadCounts.reduce((acc, follower) => acc + follower.unreadCount, 0));

      // Set up real-time listeners for each follower's messages
      fetchedFollowers.forEach((follower) => {
        const messagesRef = collection(firestore, 'Messages', authUser.uid, 'message', follower.uid, 'messages');
        const q = query(messagesRef);

        const unsubscribe = onSnapshot(q, async () => {
          // Refetch followers and update the unread counts
          const updatedFollowers = await refetchFollowers();
          const followersWithUnreadCounts = await addUnreadMessageCounts(updatedFollowers);
          setFollowers(followersWithUnreadCounts);

          // Update total unread count
          setTotalUnreadCount(followersWithUnreadCounts.reduce((acc, follower) => acc + follower.unreadCount, 0));
        });

        unsubscribeArray.push(unsubscribe);
      });
    };

    setupRealTimeListeners();

    // Cleanup on component unmount
    return () => {
      unsubscribeArray.forEach((unsubscribe) => unsubscribe());
    };
  }, [authUser, refetchFollowers]);

  const addUnreadMessageCounts = async (followers) => {
    const followersWithUnreadCount = await Promise.all(followers.map(async (follower) => {
      const messagesRef = collection(firestore, 'Messages', authUser.uid, 'message', follower.uid, 'messages');
      const q = query(messagesRef, where('isSeen', '==', false));
      const snapshot = await getDocs(q);
      const unreadCount = snapshot.size;
      return {
        ...follower,
        unreadCount,
      };
    }));

    return followersWithUnreadCount;
  };

  return (
    <PageLayout totalUnreadCount={totalUnreadCount}>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={!authUser ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/:username" element={<ProfilePage />} />
        <Route path="/MessagePage" element={<MessagePage followers={followers} isLoading={isLoading} />} />
        <Route path="/vid/:video" element={<VideoContainer followers={followers} isLoading={isLoading}/>} />
      </Routes>
    </PageLayout>
  );
}

export default App;
