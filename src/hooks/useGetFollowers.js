import { useEffect, useState, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import { collection, onSnapshot, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

export const useGetFollowers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const authUser = useAuthStore((state) => state.user);


  const fetchFollowers = useCallback(async () => {
    if (!authUser) return [];
    console.log('Fetching followers...');
    setIsLoading(true);

    const userRef = collection(firestore, 'users');
    const followersQuery = query(
      userRef,
      where('uid', 'in', [authUser.uid, ...authUser.following])
    );

    const snapshot = await getDocs(followersQuery);
    const followersData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    const fetchLatestMessageInfo = async (follower) => {
      const messagesRef = collection(firestore, 'Messages', authUser.uid, 'message', follower.uid, 'messages');
      const messagesQuery = query(messagesRef, orderBy('time', 'desc'), limit(1));
      const messageSnapshot = await getDocs(messagesQuery);
      const latestMessage = messageSnapshot.docs[0]?.data();
      
      const unseenMessage = latestMessage ? !latestMessage.isSeen && latestMessage.to === authUser.uid : false;

      return { latestMessageTime: latestMessage?.time, unseenMessage };
    };

    const updatedFollowersData = await Promise.all(followersData.map(async (follower) => {
      const { latestMessageTime, unseenMessage } = await fetchLatestMessageInfo(follower);
      return { ...follower, latestMessageTime, unseenMessage };
    }));

    updatedFollowersData.sort((a, b) => {
      if (a.latestMessageTime && b.latestMessageTime) {
        return b.latestMessageTime.toMillis() - a.latestMessageTime.toMillis();
      }
      return a.latestMessageTime ? -1 : 1;
    });

    setFollowers(updatedFollowersData);
    setIsLoading(false);

    return updatedFollowersData;
  }, [authUser]);

  useEffect(() => {
    if (!authUser) return;

    fetchFollowers();

    const messagesRef = collection(firestore, `Messages/${authUser.uid}/message`);
    const messagesQuery = query(messagesRef);

    const unsubscribe = onSnapshot(messagesQuery, () => {
      fetchFollowers();
    });

    return () => unsubscribe();
  }, [authUser, fetchFollowers]);

  return { isLoading, followers, refetch: fetchFollowers };
};
