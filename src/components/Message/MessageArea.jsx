import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Avatar, Text, Input, Button, VStack, HStack, Center, IconButton, Spinner } from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import { ProfileContext } from "./ProfileContext";
import { firestore } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, writeBatch } from "firebase/firestore";
import useAuthStore from "../../store/authStore";

const MessageArea = ({ className }) => {
  const { data } = useContext(ProfileContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!data || !authUser) return;
    setMessages([]);
    const unsubscribe = listenToMessages();

    return () => unsubscribe();
  }, [data, authUser]);


  const listenToMessages = () => {
    setIsLoading(true);
    const messagesRef = collection(firestore, `Messages/${authUser.uid}/message/${data.uid}/messages`);
    const messagesQuery = query(messagesRef, orderBy("time"));

    const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setIsLoading(false);
      setMessages(newMessages);

      // Mark received messages as seen
      const batch = writeBatch(firestore);
      snapshot.docs.forEach((doc) => {
        const messageData = doc.data();
        if (!messageData.isSeen && messageData.to === authUser.uid) {
          batch.update(doc.ref, { isSeen: true });
        }
      });

      await batch.commit();
    });

    return unsubscribe;
  };

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      const timestamp = serverTimestamp();
      const messageObject = {
        message: message,
        time: timestamp,
        to: data.uid,
        from: authUser.uid,
        isSeen: false,
      };

      try {
        // Add message to both sender's and receiver's collections
        await addDoc(collection(firestore, `Messages/${authUser.uid}/message/${data.uid}/messages`), messageObject);
        await addDoc(collection(firestore, `Messages/${data.uid}/message/${authUser.uid}/messages`), messageObject);

        setMessage(""); // Clear input field after sending message
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <Box className={className} p={4} bg="gray.100" borderRadius="md" h="100%" w="100%" maxW="70%" mx="auto">
      {data ? (
        <Flex direction="column" h="100%">
          <Flex align="center" w="100%" bg="gray.100" p={4} borderTopRadius="xl" boxShadow="2xl" borderWidth="1px" borderColor="cyan">
            <Link to={`/${data.username}`}>
              <Avatar src={data.profilePicURL} name={data.username} size="md" mr={3} />
            </Link>
            <Text fontWeight="bold">{data.username}</Text>
            <IconButton aria-label="Call" icon={<PhoneIcon />} ml="auto" colorScheme="teal" />
          </Flex>
          <Flex flex="1" direction="column-reverse" overflowY="auto" maxH="77vh" p={4} bg="white" borderRadius="md" boxShadow="sm">
            <VStack spacing={2} align="stretch">
              {isLoading ? (
                <Center h="100%">
                  <Spinner size="xl" />
                </Center>
              ) : (
                messages.map((msg) => (
                  <Box
                    key={msg.id}
                    bg={msg.from === authUser.uid ? "blue.100" : "gray.200"}
                    p={2}
                    borderRadius="md"
                    alignSelf={msg.from === authUser.uid ? "flex-end" : "flex-start"}
                    maxWidth="70%"
                    textAlign={msg.from === authUser.uid ? "right" : "left"}
                  >
                    {msg.message}
                  </Box>
                ))
              )}
            </VStack>
          </Flex>
          <HStack w="100%" spacing={3} mt={3}>
            <Input
              bg="white"
              placeholder="Type your message..."
              _placeholder={{ color: 'black' }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              borderColor="cyan.700"
              borderWidth="1px"
            />
            <Button colorScheme="blue" onClick={handleSendMessage}>
              Send
            </Button>
          </HStack>
        </Flex>
      ) : (
        <Center h="100%">
          <Text>Select a user to start chatting</Text>
        </Center>
      )}
    </Box>
  );
};

export default MessageArea;
