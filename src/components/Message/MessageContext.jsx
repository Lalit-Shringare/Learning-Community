import { createContext, useState, useEffect } from "react";
import { firestore } from "../../firebase/firebase";
import { collection, query, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import useAuthStore from "../../store/authStore";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!authUser) return;

    // Query to get messages from all users who have communicated with the current user
    const messagesRef = collection(firestore, `Messages/${authUser.uid}/message`);
    const messagesQuery = query(messagesRef);

    const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
      const messagesData = [];

      for (const doc of snapshot.docs) {
        const userMessagesRef = collection(firestore, `Messages/${authUser.uid}/message/${doc.id}/messages`);
        const userMessagesQuery = query(userMessagesRef, orderBy("time"));

        const userMessagesSnapshot = await getDocs(userMessagesQuery); // Fetch the documents initially

        userMessagesSnapshot.forEach((messageDoc) => {
          messagesData.push({ id: messageDoc.id, ...messageDoc.data(), userId: doc.id });
        });

        // Attach a real-time listener for each user's messages
        onSnapshot(userMessagesQuery, (messageSnapshot) => {
          const realTimeMessages = [];
          messageSnapshot.forEach((messageDoc) => {
            realTimeMessages.push({ id: messageDoc.id, ...messageDoc.data(), userId: doc.id });
          });
          setMessages((prevMessages) => {
            // Filter out old messages from this user
            const filteredMessages = prevMessages.filter((msg) => msg.userId !== doc.id);
            // Add the new messages
            return [...filteredMessages, ...realTimeMessages];
          });
        });
      }

      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [authUser]);

  return (
    <MessageContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessageContext.Provider>
  );
};
