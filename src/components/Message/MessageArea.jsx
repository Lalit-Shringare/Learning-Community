import { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Flex, Avatar, Text, Input, Button, VStack, HStack, Center, IconButton, Spinner, useMediaQuery, Link, useDisclosure } from "@chakra-ui/react";
import { PhoneIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { ProfileContext } from "./ProfileContext";
import { firestore } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, writeBatch } from "firebase/firestore";
import useAuthStore from "../../store/authStore";
import ReactPlayer from 'react-player';
import ReelContainer from "./ReelContainer";

const MessageArea = ({ className, selectedProfile, setSelectedProfile }) => {
  const { data } = useContext(ProfileContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);

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
      const senderMessageObject = {
        message: message,
        time: timestamp,
        to: data.uid,
        from: authUser.uid,
        isSeen: true,
      };
      const receiverMessageObject = {
        message: message,
        time: timestamp,
        to: data.uid,
        from: authUser.uid,
        isSeen: false,
      };

      try {
        await addDoc(collection(firestore, `Messages/${authUser.uid}/message/${data.uid}/messages`), senderMessageObject);
        await addDoc(collection(firestore, `Messages/${data.uid}/message/${authUser.uid}/messages`), receiverMessageObject);

        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const renderMessageContent = (msg) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const firebaseVideoUrlRegex = /^https:\/\/firebasestorage\.googleapis\.com/;

    if (urlRegex.test(msg.message)) {
      const parts = msg.message.split(urlRegex);
      return parts.map((part, index) => {
        if (firebaseVideoUrlRegex.test(part)) {
          return (
            <Box key={index} w="100%" maxW="500px" borderRadius="md" overflow="hidden" mt={2} mb={2}>
              <ReactPlayer 
                loop
                width="100%" 
                url={part}
                onClick={() => {
                  setSelectedVideoUrl(part);
                  onOpen();
                }}
                style={{ borderRadius: "10px" }}
              />
            </Box>
          );
        } else if (urlRegex.test(part)) {
          return (
            <Link key={index} href={part} color="teal.500" isExternal>
              {part}
            </Link>
          );
        } else {
          return part;
        }
      });
    }
    return msg.message;
  };

  return (
    <Box
      className={className}
      p={4}
      bg="gray.100"
      borderRadius="md"
      h="100%"
      w={{ base: "100%", md: "70%" }}
      mx="auto"
      display={selectedProfile ? "block" : { base: "none", md: "block" }}
    >
      {data ? (
        <Flex direction="column" h="100%">
          <Flex
            align="center"
            w="100%"
            bg="gray.100"
            p={4}
            borderTopRadius="xl"
            boxShadow="0px 0px 4px cyan"
            borderWidth="1px"
          >
            {!isLargerThan768 && (
              <IconButton
                aria-label="Back"
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedProfile(null)}
                mr={3}
                color={"black"}
              />
            )}
            <RouterLink to={`/${data.username}`}>
              <Avatar src={data.profilePicURL} name={data.username} size="md" mr={3} />
            </RouterLink>
            <Text fontWeight="bold">{data.username}</Text>
            <IconButton aria-label="Call" icon={<PhoneIcon />} ml="auto" colorScheme="teal" />
          </Flex>
          <Flex
            flex="1"
            direction="column-reverse"
            overflowY="auto"
            maxH="77vh"
            p={4}
            bg="white"
            borderRadius="md"
            boxShadow="sm"
            sx={{
              "::-webkit-scrollbar": {
                width: "5px",
              },
              "::-webkit-scrollbar-track": {
                bg: "gray.100",
              },
              "::-webkit-scrollbar-thumb": {
                bg: "gray.500",
                borderRadius: "8px",
              },
            }}
          >
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
                    {renderMessageContent(msg)}
                  </Box>
                ))
              )}
            </VStack>
          </Flex>
          <HStack w="100%" spacing={3} mt={3}>
            <Input
              bg="white"
              placeholder="Type a message"
              _placeholder={{ color: "gray" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              boxShadow={"0px 0px 4px cyan"}
            />
            <Button colorScheme="teal" onClick={handleSendMessage}>
              Send
            </Button>
          </HStack>
        </Flex>
      ) : (
        <Center h="100%">
          <Text fontSize="xl">Select a profile to start chatting</Text>
        </Center>
      )}

      {selectedVideoUrl && (
        <ReelContainer isOpen={isOpen} onClose={onClose} url={selectedVideoUrl} />
      )}
    </Box>
  );
};

export default MessageArea;
